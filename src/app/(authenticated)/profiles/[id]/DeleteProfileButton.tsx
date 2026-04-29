"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/lib/env";
import { getCsrfToken } from "@/lib/csrf";

export function DeleteProfileButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const csrfToken = getCsrfToken();
      const headers: Record<string, string> = { "X-API-Version": "1" };
      if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

      const res = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL}/api/profiles/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers,
        },
      );

      if (res.status === 204 || res.ok) {
        router.push("/profiles");
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(
        (data as { message?: string }).message ?? "Failed to delete profile",
      );
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Delete profile failed:", err);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-600">{error}</span>}
        <span className="text-sm text-slate-600">Delete this profile?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-button bg-error px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
          disabled={deleting}
          className="rounded-button border border-border-subtle px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-button bg-error px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      Delete
    </button>
  );
}
