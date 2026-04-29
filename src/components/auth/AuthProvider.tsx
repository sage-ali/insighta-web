"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "@/features/auth/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    try {
      // Import CSRF token dynamically to avoid SSR issues
      const { getCsrfToken } = await import("@/lib/csrf");
      const csrfToken = getCsrfToken();

      // Call backend logout endpoint to clear cookies
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-API-Version": "1",
      };

      // Add CSRF token if available
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken;
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers,
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear user state and redirect
      setUser(null);
      setError(null);
      window.location.href = "/login";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, setUser, logout, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
