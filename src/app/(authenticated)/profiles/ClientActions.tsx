"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { env } from "@/lib/env";
import { getCsrfToken } from "@/lib/csrf";
import { Profile } from "@/features/profiles/types";

interface ClientActionsProps {
  filters?: {
    gender?: string;
    country_id?: string;
    age_group?: string;
  };
  onProfileCreated?: (profile: Profile) => void;
}

export function ClientActions({
  filters = {},
  onProfileCreated,
}: ClientActionsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({ format: "csv" });
      if (filters.gender) params.set("gender", filters.gender);
      if (filters.country_id) params.set("country_id", filters.country_id);
      if (filters.age_group) params.set("age_group", filters.age_group);

      const res = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL}/api/profiles/export?${params.toString()}`,
        {
          credentials: "include",
          headers: { "X-API-Version": "1" },
        },
      );

      if (!res.ok) throw new Error("Export failed");

      const disposition = res.headers.get("content-disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `profiles_${Date.now()}.csv`;

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateProfile = async (name: string) => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const csrfToken = getCsrfToken();
      const headers: Record<string, string> = {
        "X-API-Version": "1",
        "Content-Type": "application/json",
      };
      if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

      const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/profiles`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.message ?? "Failed to create profile");
        return;
      }

      onProfileCreated?.(data.data as Profile);
      setShowCreateModal(false);
    } catch (err) {
      setCreateError("An unexpected error occurred");
      console.error("Create profile failed:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={handleExportCSV}
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>

        <RoleGuard roles={["ADMIN"]}>
          <Button onClick={() => setShowCreateModal(true)}>Add Profile</Button>
        </RoleGuard>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-title-lg mb-4">Create New Profile</h2>
            {createError && (
              <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {createError}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                if (name) void handleCreateProfile(name);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter person's first name"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError(null);
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
