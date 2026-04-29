import { Profile } from "@/features/profiles/types";

/**
 * Convert profiles array to CSV format
 */
export function generateProfilesCSV(profiles: Profile[]): string {
  // CSV Headers
  const headers = [
    "id",
    "name",
    "gender",
    "gender_probability",
    "age",
    "age_group",
    "country_id",
    "country_name",
    "country_probability",
    "created_at",
  ];

  // Build CSV rows
  const rows = profiles.map((profile) => [
    profile.id,
    escapeCSVField(profile.name),
    profile.gender,
    profile.gender_probability,
    profile.age,
    profile.age_group,
    profile.country_id,
    profile.country_name,
    profile.country_probability,
    profile.created_at,
  ]);

  // Combine headers and rows
  const csvLines = [headers.join(","), ...rows.map((row) => row.join(","))];

  return csvLines.join("\n");
}

/**
 * Escape CSV field if it contains special characters
 */
function escapeCSVField(field: string | number): string {
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate timestamp for filename
 */
export function getCSVFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  return `profiles_${timestamp}.csv`;
}
