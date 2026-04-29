"use client";

import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Profile, ProfilesResponse } from "@/features/profiles/types";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";

const profileColumns: Column<Profile>[] = [
  { header: "Name", accessor: "name" },
  { header: "Country", accessor: "country_name" },
  { header: "Age", accessor: "age" },
  {
    header: "Created At",
    accessor: "created_at",
    render: (value) => formatDate(String(value)),
  },
];

export default function DashboardPage() {
  const [total, setTotal] = useState(0);
  const [recentProfiles, setRecentProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetchWithAuth<ProfilesResponse>(
          "/api/profiles",
          {
            params: { limit: 5, sort_by: "created_at", order: "desc" },
          },
        );
        setRecentProfiles(response.data ?? []);
        setTotal(response.total ?? 0);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-title-xl">Overview</h1>
        <p className="text-body-md text-slate-500">
          Welcome back to the Insighta Intelligence Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="insighta-card">
          <p className="text-label-md">Total Profiles</p>
          <p className="text-title-xl mt-2">{total.toLocaleString()}</p>
        </div>
        <div className="insighta-card">
          <p className="text-label-md">New This Week</p>
          <p className="text-title-xl mt-2 text-success">—</p>
        </div>
        <div className="insighta-card">
          <p className="text-label-md">Search Volume</p>
          <p className="text-title-xl mt-2">—</p>
        </div>
      </div>

      <div className="insighta-card overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-title-lg">Recent Profiles</h2>
          <Link
            href="/profiles"
            className="text-primary text-sm font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="-mx-6">
          <DataTable
            columns={profileColumns}
            data={recentProfiles}
            emptyState="No recent profiles found."
          />
        </div>
      </div>
    </div>
  );
}
