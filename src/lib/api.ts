export const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]*$/, "");

export function getToken(): string | null {
  return localStorage.getItem("verifo_jwt");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handleUnauth() {
  localStorage.removeItem("verifo_jwt");
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}/sign-in`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}/api${path}`, { headers: authHeaders() });
  if (res.status === 401) { handleUnauth(); throw new ApiError("Unauthorized", 401); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError((err as any).error || `API error ${res.status}`, res.status);
  }
  return res.json();
}

export async function apiPost(path: string, body: object) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) { handleUnauth(); throw new ApiError("Unauthorized", 401); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError((err as any).error || `API error ${res.status}`, res.status);
  }
  return res.json();
}
