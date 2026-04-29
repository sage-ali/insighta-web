"use client";

import { useAuth } from "./AuthProvider";
import { UserRole } from "@/features/auth/types";

interface RoleGuardProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
