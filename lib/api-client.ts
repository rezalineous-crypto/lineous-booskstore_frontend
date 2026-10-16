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

  // Session expired: drop the dead token (and cached user)
  if (response.status === 401 && typeof window !== "undefined") {
    removeToken();
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