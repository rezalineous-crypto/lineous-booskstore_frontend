import { ApiError } from "./api-client";

/**
 * Maps API/network errors to short, user-friendly messages.
 * Raw backend messages (which can leak internal details) are never shown
 * directly — technical details go to the console via logError().
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // Validation errors carry field-level messages that are safe and useful to show
    if (error.errors && error.errors.length > 0) {
      return error.errors.map((e) => e.message).join(", ");
    }

    switch (error.statusCode) {
      case 0:
        // Network failure or timeout (set by api-client)
        return "Can't reach the server. Please check your connection and try again.";
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return "You don't have permission to do that.";
      case 404:
        return "We couldn't find what you were looking for.";
      case 409:
        return "This conflicts with something that already exists.";
      case 422:
        return "Please check your input and try again.";
      default:
        if (error.statusCode >= 500) {
          return "Something went wrong on our end. Please try again later.";
        }
        return "Something went wrong. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}

/**
 * Logs technical error details for debugging. Console-only — never surfaced
 * in the UI. Silenced in production to avoid noise (wire to an error
 * reporting service here if you add one).
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(context ? `[${context}]` : "", error);
  }
}
