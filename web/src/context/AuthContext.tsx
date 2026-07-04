
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  VeritasUser,
  getToken, setToken, clearToken,
  getStoredUser, setStoredUser,
  apiLogin, apiRegister, apiGetMe,
} from "@/lib/auth";

// ─────────────────────────────────────────
// Public routes that don't need auth
// ─────────────────────────────────────────
const PUBLIC_ROUTES = [
  "/", "/login", "/signup", "/pricing", "/blog",
  "/waitlist", "/landing-v2", "/stats", "/badges",
  "/how-matching-works", "/escrow-simulator",
  "/mobile-preview", "/contact", "/help",
];

interface AuthContextType {
  user:     VeritasUser | null;
  loading:  boolean;
  login:    (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout:   () => void;
  isAuth:   boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  login: async () => {}, register: async () => {}, logout: () => {},
  isAuth: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]       = useState<VeritasUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount ──
  useEffect(() => {
    async function restore() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      // Try to restore from localStorage first (instant)
      const stored = getStoredUser();
      if (stored) setUser(stored);
      // Then verify with backend
      try {
        const me = await apiGetMe(token);
        setUser(me);
        setStoredUser(me);
      } catch {
        // Token invalid — clear and redirect if on protected route
        clearToken();
        setUser(null);
      }
      setLoading(false);
    }
    restore();
  }, []);

  // ── Route guard ──
  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + "/"));
    if (!user && !isPublic) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname]);

  async function login(email: string, password: string) {
    const { token, user } = await apiLogin(email, password);
    setToken(token);
    setStoredUser(user);
    setUser(user);
  }

  async function register(name: string, email: string, password: string, role = "worker") {
    const { token, user } = await apiRegister(name, email, password, role);
    if (token) {
      setToken(token);
      setStoredUser(user);
    }
    setUser(user);
  }

  function logout() {
    clearToken();
    setUser(null);
    router.replace("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
