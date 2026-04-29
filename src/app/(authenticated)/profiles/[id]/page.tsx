import { fetchWithAuth } from "@/lib/api";
import { Profile } from "@/features/profiles/types";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/features/auth/actions";
import { notFound } from "next/navigation";
import { DeleteProfileButton } from "./DeleteProfileButton";

export const dynamic = "force-dynamic";

interface ProfileDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getProfile(id: string) {
  try {
    const response = await fetchWithAuth<{ status: string; data: Profile }>(
      `/api/profiles/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch profile ${id}:`, error);
    return null;
  }
}

export default async function ProfileDetailPage({
  params,
}: ProfileDetailPageProps) {
  const { id } = await params;
  const [profile, user] = await Promise.all([getProfile(id), getCurrentUser()]);

  if (!profile) {
    notFound();
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-title-xl">{profile.name}</h1>
        {isAdmin && (
          <div className="flex gap-3">
            <DeleteProfileButton id={profile.id} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Primary Info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="insighta-card flex flex-col items-center text-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-slate-200 text-4xl font-bold text-slate-400">
              {profile.name.charAt(0)}
            </div>
            <h2 className="text-title-lg">{profile.name}</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">
              {profile.age_group}
            </p>

            <div className="mt-8 w-full border-t border-border-subtle space-y-4 pt-8 text-left">
              <div>
                <p className="text-label-md">Country</p>
                <p className="text-body-md font-medium">
                  {profile.country_name}
                </p>
              </div>
              <div>
                <p className="text-label-md">Gender</p>
                <p className="text-body-md font-medium capitalize">
                  {profile.gender}
                </p>
              </div>
              <div>
                <p className="text-label-md">Age</p>
                <p className="text-body-md font-medium">{profile.age}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Intelligence Metadata */}
        <div className="space-y-6 lg:col-span-2">
          <div className="insighta-card">
            <h2 className="text-title-lg mb-6">Intelligence Metadata</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-label-md">Gender Probability</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${profile.gender_probability * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {(profile.gender_probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-label-md">Country Probability</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${profile.country_probability * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {(profile.country_probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="insighta-card">
            <h2 className="text-title-lg mb-6">Timeline</h2>
            <div className="relative space-y-8 border-l-2 border-slate-100 pl-8">
              <div className="relative">
                <div className="absolute -left-10.25 top-1 h-4 w-4 rounded-full border-4 border-white bg-primary" />
                <div>
                  <p className="text-sm font-bold">Profile Created</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(profile.created_at)}
                  </p>
                  <p className="text-body-md mt-2 text-slate-600">
                    System successfully enriched intelligence data for{" "}
                    {profile.name}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
