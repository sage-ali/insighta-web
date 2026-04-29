import { fetchWithAuth } from "@/lib/api";
import { ProfilesResponse } from "@/features/profiles/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function searchProfiles(query: string) {
  try {
    return await fetchWithAuth<ProfilesResponse>("/api/profiles/search", {
      params: { q: query },
    });
  } catch (error) {
    console.error("Search failed:", error);
    return null;
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;
  const resultsData = query ? await searchProfiles(query) : null;
  const results = resultsData?.data || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-title-xl">Search</h1>
        <p className="text-body-md text-slate-500">
          Search the Profile Intelligence System using natural language.
        </p>
      </div>

      <div className="max-w-2xl">
        <form className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="e.g., 'Find all females from the US over 30'"
            className="text-body-md w-full rounded-lg border border-border-subtle bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <button type="submit" className="hidden">
            Search
          </button>
        </form>
      </div>

      {query && (
        <div className="space-y-4">
          <h2 className="text-title-lg">Results for &quot;{query}&quot;</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {results.length > 0 ? (
              results.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/profiles/${profile.id}`}
                  className="insighta-card cursor-pointer transition-colors hover:border-primary"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-body-md font-bold text-slate-900">
                        {profile.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {profile.country_name} • {profile.age} years old
                      </p>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {profile.age_group}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 rounded-lg border border-border-subtle bg-white py-12 text-center text-slate-500">
                No results found for your query. Try a different search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
