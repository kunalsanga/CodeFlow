/**
 * Base API URL resolver for CodeFlow Frontend.
 * Uses NEXT_PUBLIC_API_URL in production or defaults to http://localhost:8000 in local dev.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}
