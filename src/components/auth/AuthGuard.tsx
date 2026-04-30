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
      try {
        const res = await fetch(
          `${env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`,
          {
            credentials: "include",
            headers: { "X-API-Version": "1" },
          },
        );

        if (!res.ok) {
          router.push("/login?error=unauthorized");
          return;
        }

        const data: WhoamiResponse = await res.json();
        setUser(data.data);
      } catch {
        // Network error — let pages handle their own errors
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
