
// ─────────────────────────────────────────
// Veritas Auth Helpers
// ─────────────────────────────────────────

const TOKEN_KEY = "veritas_token";
const USER_KEY  = "veritas_user";

export interface VeritasUser {
  id:    string;
  name?: string;
  email: string;
  role?: string;
  trustScore?: number;
  avatar?: string;
}

// ── Token helpers ──
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ── User helpers ──
export function getStoredUser(): VeritasUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setStoredUser(user: VeritasUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ── API calls ──
const API = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiLogin(email: string, password: string): Promise<{ token: string; user: VeritasUser }> {
  const res = await fetch(`${API}/api/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.success && !data.token) throw new Error(data.message || "Login failed");
  return { token: data.token, user: data.user };
}

export async function apiRegister(name: string, email: string, password: string, role = "worker"): Promise<{ token?: string; user: VeritasUser }> {
  const res = await fetch(`${API}/api/auth/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Registration failed");
  return { token: data.token, user: data.user };
}

export async function apiGetMe(token: string): Promise<VeritasUser> {
  const res = await fetch(`${API}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error("Session expired");
  return data.user;
}

export function apiHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
