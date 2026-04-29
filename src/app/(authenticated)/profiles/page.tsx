"use client";

import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ClientActions } from "./ClientActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Profile, ProfilesResponse } from "@/features/profiles/types";

type SortBy = "age" | "created_at" | "gender_probability";
type Order = "asc" | "desc";

function parseLinkPage(link: string | null): string | null {
  if (!link) return null;
  try {
    const url = new URL(link, "http://placeholder");
    return url.searchParams.get("page");
  } catch {
    return null;
  }
}

export default function ProfilesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const genderParam = searchParams.get("gender") ?? "";
  const countryParam = searchParams.get("country_id") ?? "";
  const ageGroupParam = searchParams.get("age_group") ?? "";
  const minAgeParam = searchParams.get("min_age") ?? "";
  const maxAgeParam = searchParams.get("max_age") ?? "";
  const minGenderProbParam = searchParams.get("min_gender_probability") ?? "";
  const minCountryProbParam = searchParams.get("min_country_probability") ?? "";
  const sortByParam = (searchParams.get("sort_by") ?? "") as SortBy | "";
  const orderParam = (searchParams.get("order") ?? "") as Order | "";

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState<ProfilesResponse["links"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local filter state — committed to URL on Apply
  const [gender, setGender] = useState(genderParam);
  const [countryId, setCountryId] = useState(countryParam);
  const [ageGroup, setAgeGroup] = useState(ageGroupParam);
  const [minAge, setMinAge] = useState(minAgeParam);
  const [maxAge, setMaxAge] = useState(maxAgeParam);
  const [minGenderProb, setMinGenderProb] = useState(minGenderProbParam);
  const [minCountryProb, setMinCountryProb] = useState(minCountryProbParam);
  const [sortBy, setSortBy] = useState<SortBy | "">(sortByParam);
  const [order, setOrder] = useState<Order | "">(orderParam);

  useEffect(() => {
    let cancelled = false;

    async function loadProfiles() {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = { page, limit };
        if (genderParam) params.gender = genderParam;
        if (countryParam) params.country_id = countryParam;
        if (ageGroupParam) params.age_group = ageGroupParam;
        if (minAgeParam) params.min_age = minAgeParam;
        if (maxAgeParam) params.max_age = maxAgeParam;
        if (minGenderProbParam)
          params.min_gender_probability = minGenderProbParam;
        if (minCountryProbParam)
          params.min_country_probability = minCountryProbParam;
        if (sortByParam) params.sort_by = sortByParam;
        if (orderParam) params.order = orderParam;

        const response = await fetchWithAuth<ProfilesResponse>(
          "/api/profiles",
          { params },
        );
        if (!cancelled) {
          setProfiles(response.data ?? []);
          setTotalPages(response.total_pages ?? 1);
          setTotal(response.total ?? 0);
          setLinks(response.links ?? null);
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load profiles");
        console.error("Failed to load profiles:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfiles();
    return () => {
      cancelled = true;
    };
  }, [
    page,
    limit,
    genderParam,
    countryParam,
    ageGroupParam,
    minAgeParam,
    maxAgeParam,
    minGenderProbParam,
    minCountryProbParam,
    sortByParam,
    orderParam,
  ]);

  function applyFilters() {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (gender) params.set("gender", gender);
    if (countryId) params.set("country_id", countryId);
    if (ageGroup) params.set("age_group", ageGroup);
    if (minAge) params.set("min_age", minAge);
    if (maxAge) params.set("max_age", maxAge);
    if (minGenderProb) params.set("min_gender_probability", minGenderProb);
    if (minCountryProb) params.set("min_country_probability", minCountryProb);
    if (sortBy) params.set("sort_by", sortBy);
    if (order) params.set("order", order);
    router.push(`/profiles?${params.toString()}`);
  }

  function navigateToLink(link: string | null) {
    const nextPage = parseLinkPage(link);
    if (!nextPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage);
    router.push(`/profiles?${params.toString()}`);
  }

  function handleProfileCreated(profile: Profile) {
    setProfiles((prev) => [profile, ...prev]);
  }

  const hasActiveFilters = !!(
    genderParam ||
    countryParam ||
    ageGroupParam ||
    minAgeParam ||
    maxAgeParam ||
    minGenderProbParam ||
    minCountryProbParam ||
    sortByParam ||
    orderParam
  );

  const inputClass =
    "rounded border border-border-subtle bg-white px-3 py-1 text-sm";
  const labelClass =
    "text-[10px] font-bold uppercase tracking-wider text-slate-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title-xl">Profiles</h1>
          <p className="text-body-md text-slate-500">
            Manage and view enriched intelligence profiles.
          </p>
        </div>
        <ClientActions
          filters={{ gender: genderParam, country_id: countryParam }}
          onProfileCreated={handleProfileCreated}
        />
      </div>

      {/* Filter Bar */}
      <div className="insighta-card border-none bg-slate-50 py-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={inputClass}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Age Group</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className={inputClass}
            >
              <option value="">All</option>
              <option value="infant">Infant</option>
              <option value="child">Child</option>
              <option value="teen">Teen</option>
              <option value="young adult">Young Adult</option>
              <option value="adult">Adult</option>
              <option value="middle aged">Middle Aged</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Country Code</label>
            <input
              type="text"
              value={countryId}
              onChange={(e) =>
                setCountryId(e.target.value.toUpperCase().slice(0, 2))
              }
              placeholder="e.g. NG"
              maxLength={2}
              className={`${inputClass} w-20 uppercase`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Min Age</label>
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              placeholder="0"
              min={0}
              className={`${inputClass} w-20`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Max Age</label>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              placeholder="100"
              min={0}
              className={`${inputClass} w-20`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Min Gender Prob.</label>
            <input
              type="number"
              value={minGenderProb}
              onChange={(e) => setMinGenderProb(e.target.value)}
              placeholder="0.0"
              min={0}
              max={1}
              step={0.1}
              className={`${inputClass} w-24`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Min Country Prob.</label>
            <input
              type="number"
              value={minCountryProb}
              onChange={(e) => setMinCountryProb(e.target.value)}
              placeholder="0.0"
              min={0}
              max={1}
              step={0.1}
              className={`${inputClass} w-24`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy | "")}
              className={inputClass}
            >
              <option value="">Default</option>
              <option value="age">Age</option>
              <option value="created_at">Created At</option>
              <option value="gender_probability">Gender Prob.</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Order</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as Order | "")}
              className={inputClass}
            >
              <option value="">Default</option>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={applyFilters}
              className="rounded border border-border-subtle bg-white px-4 py-1 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              Apply
            </button>
            {hasActiveFilters && (
              <button
                onClick={() => router.push("/profiles")}
                className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="insighta-card overflow-hidden p-0">
        {loading ? (
          <div className="flex min-h-75 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-sm text-slate-600">Loading profiles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-subtle bg-slate-50">
                    <th className="px-6 py-3 text-label-md">Name</th>
                    <th className="px-6 py-3 text-label-md">Gender</th>
                    <th className="px-6 py-3 text-label-md">Age</th>
                    <th className="px-6 py-3 text-label-md">Country</th>
                    <th className="px-6 py-3 text-label-md">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {profiles.length > 0 ? (
                    profiles.map((profile) => (
                      <tr
                        key={profile.id}
                        className="group table-row-hover cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/profiles/${profile.id}`}
                            className="text-body-md font-medium text-slate-900 group-hover:text-primary"
                          >
                            {profile.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-body-md capitalize text-slate-600">
                          {profile.gender}
                        </td>
                        <td className="px-6 py-4 text-body-md text-slate-600">
                          {profile.age}
                        </td>
                        <td className="px-6 py-4 text-body-md text-slate-600">
                          {profile.country_name}
                        </td>
                        <td className="px-6 py-4 text-body-md text-slate-500">
                          {formatDate(profile.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No profiles found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-border-subtle bg-slate-50 px-6 py-4">
              <span className="text-sm text-slate-500">
                {total > 0 ? `${total} total · ` : ""}Page {page} of{" "}
                {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateToLink(links?.prev ?? null)}
                  disabled={!links?.prev}
                  className="rounded border border-border-subtle bg-white px-3 py-1 text-sm disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => navigateToLink(links?.next ?? null)}
                  disabled={!links?.next}
                  className="rounded border border-border-subtle bg-white px-3 py-1 text-sm disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
