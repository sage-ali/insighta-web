import { env } from "./env";
import { getCsrfToken } from "./csrf";

const API_VERSION = "1";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  _retry?: boolean;
}

interface BaseResponse {
  message?: string;
  status?: string;
}

async function attemptRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers: customHeaders, _retry = false, ...rest } = options;

  const url = new URL(`${env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers = new Headers(customHeaders);
  headers.set("X-API-Version", API_VERSION);
  headers.set("Content-Type", "application/json");

  const method = (rest.method || "GET").toUpperCase();
  const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

  if (isStateChanging && typeof window !== "undefined") {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  }

  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      if (cookieHeader) {
        headers.set("Cookie", cookieHeader);
      }
    } catch (error) {
      console.error("Failed to retrieve cookies in server context:", error);
    }
  }

  const response = await fetch(url.toString(), {
    ...rest,
    headers,
    credentials: "include",
  });

  // 401: try refresh once (client-side only), then retry the original request
  if (response.status === 401 && !_retry && typeof window !== "undefined") {
    const refreshed = await attemptRefresh();
    if (!refreshed) {
      window.location.href = `/auth/github?client_type=web`;
      throw new Error("Session expired");
    }
    return fetchWithAuth<T>(endpoint, { ...options, _retry: true });
  }

  const contentType = response.headers.get("content-type");
  if (contentType && !contentType.includes("application/json")) {
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return (await response.blob()) as unknown as T;
  }

  const data = (await response.json()) as T & BaseResponse;

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}
