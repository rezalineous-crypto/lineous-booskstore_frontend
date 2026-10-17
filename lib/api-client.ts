import { ApiResponse } from "./types";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Token management
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", token);
  // Also set a cookie so Next.js middleware can read it for route protection
  document.cookie = `accessToken=${token}; path=/; max-age=604800; sameSite=lax`;
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  document.cookie = "accessToken=; path=/; max-age=0";
};

// Refresh token management
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

export const setRefreshToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("refreshToken", token);
};

export const removeRefreshToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("refreshToken");
};

// Clear all auth tokens
export const clearAuthTokens = (): void => {
  removeToken();
  removeRefreshToken();
};

// Refresh token lock — prevents multiple concurrent refresh requests
// (thundering herd problem when multiple API calls fail with 401 simultaneously)
let refreshPromise: Promise<string | null> | null = null;

/**
 * Performs a token refresh with deduplication. If a refresh is already in
 * progress, returns the existing promise so all callers share the same result.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData?.data?.accessToken || refreshData?.accessToken;
        const newRefreshToken = refreshData?.data?.refreshToken || refreshData?.refreshToken;

        if (newAccessToken) {
          setToken(newAccessToken);
          if (newRefreshToken) setRefreshToken(newRefreshToken);
          return newAccessToken;
        }
      }
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// API Error class
export class ApiError extends Error {
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(message: string, statusCode: number, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Request timeout (ms) — prevents hung requests from spinning forever
const REQUEST_TIMEOUT = 30_000;

// Base request function
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Abort the request if it takes too long
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        "The request timed out. Please try again.",
        0,
      );
    }
    throw new ApiError(
      "Can't reach the server. Please check your connection and try again.",
      0,
    );
  }
  clearTimeout(timeoutId);

  // Session expired: try to refresh the token first (deduplicated via lock)
  if (response.status === 401 && typeof window !== "undefined" && !endpoint.startsWith("/auth/refresh")) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      // Retry the original request with the new token
      const retryHeaders = { ...headers, Authorization: `Bearer ${newAccessToken}` };
      const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: retryHeaders,
        signal: options.signal ?? controller.signal,
      });
      clearTimeout(timeoutId);
      const retryRaw = await retryResponse.text();
      let retryData: unknown = null;
      if (retryRaw) {
        try { retryData = JSON.parse(retryRaw); } catch { /* ignore */ }
      }
      if (!retryResponse.ok) {
        const payload = (retryData ?? {}) as { message?: string; errors?: Array<{ field: string; message: string }> };
        throw new ApiError(payload.message || "Something went wrong. Please try again.", retryResponse.status, payload.errors);
      }
      return retryData as ApiResponse<T>;
    }

    // Refresh failed or no refresh token: drop tokens and redirect
    clearAuthTokens();
    localStorage.removeItem("user");
    if (!window.location.pathname.startsWith("/login")) {
      const callbackUrl = window.location.pathname;
      window.location.assign(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }

  // Parse the body safely — error pages (HTML) and empty 204 bodies are not JSON
  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      if (!response.ok) {
        throw new ApiError(
          "Something went wrong on our end. Please try again later.",
          response.status,
        );
      }
      // Successful response with a non-JSON body: hand it back untouched
      return raw as unknown as ApiResponse<T>;
    }
  }

  if (!response.ok) {
    const payload = (data ?? {}) as {
      message?: string;
      errors?: Array<{ field: string; message: string }>;
    };
    throw new ApiError(
      payload.message || "Something went wrong. Please try again.",
      response.status,
      payload.errors,
    );
  }

  return data as ApiResponse<T>;
}

// API client
export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};

// Helper to extract data from API response
export const extractData = <T>(response: ApiResponse<T>): T => response.data;