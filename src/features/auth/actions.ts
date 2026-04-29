"use server";

import { fetchWithAuth } from "@/lib/api";
import { WhoamiResponse, User } from "./types";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetchWithAuth<WhoamiResponse>("/auth/whoami");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}
