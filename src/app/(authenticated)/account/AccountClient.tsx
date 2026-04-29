"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { cn } from "@/lib/utils";

export function AccountClient() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="insighta-card py-12 text-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="insighta-card py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="insighta-card py-12 text-center">
        <p className="text-slate-500">No user logged in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-title-xl">Account</h1>
        <p className="text-body-md text-slate-500">
          Manage your internal profile and session.
        </p>
      </div>

      <div className="insighta-card max-w-2xl">
        <div className="flex items-center gap-6 border-b border-border-subtle pb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-400">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-title-lg">{user.name ?? user.username}</h2>
            <p className="text-body-md text-slate-500">@{user.username}</p>
            <p className="text-body-md text-slate-500">
              {user.email ?? "No email provided"}
            </p>
            <div className="mt-2 inline-flex items-center">
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                  user.role === "ADMIN"
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-100 text-slate-500",
                )}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 py-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-label-md">Status</p>
              <p className="text-body-md font-medium text-success">
                {user.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <p className="text-label-md">Member Since</p>
              <p className="text-body-md font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-6">
            <p className="text-label-md mb-2">GitHub ID</p>
            <p className="text-body-md font-mono text-slate-600">
              {user.githubId}
            </p>
          </div>

          <div className="border-t border-border-subtle pt-6">
            <p className="text-label-md mb-2">Last Login</p>
            <p className="text-body-md text-slate-600">
              {new Date(user.lastLoginAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-border-subtle pt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
