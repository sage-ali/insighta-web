"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { env } from "@/lib/env";
import { WhoamiResponse } from "@/features/auth/types";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, setUser, setLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const hasCookie = document.cookie.includes("access_token");

      if (!hasCookie) {
        router.push("/login?error=unauthorized");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/auth/whoami`, {
          credentials: "include",
          headers: { "X-API-Version": "1" },
        });

        if (!res.ok) {
          // 401 from whoami means session is dead — redirect to login
          router.push("/login?error=unauthorized");
          setLoading(false);
          return;
        }

        const data: WhoamiResponse = await res.json();
        setUser(data.data);
      } catch {
        // Network error — still let the user in, pages handle their own errors
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, setLoading, setUser]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-main">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
