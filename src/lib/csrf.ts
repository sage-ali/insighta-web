/**
 * CSRF Token Utility
 * Handles reading CSRF tokens from cookies for the double-submit cookie pattern.
 * Backend sets a readable csrf_token cookie that we must include in X-CSRF-Token header.
 */

/**
 * Reads a cookie value by name from document.cookie
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null; // Server-side, no cookies accessible
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }

  return null;
}

/**
 * Gets the CSRF token from the csrf_token cookie.
 * Returns null if not found or in server context.
 */
export function getCsrfToken(): string | null {
  return getCookie("csrf_token");
}

/**
 * Checks if a CSRF token exists
 */
export function hasCsrfToken(): boolean {
  return getCsrfToken() !== null;
}
