"use server";

import { fetchWithAuth } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Logs out the current user by invalidating the refresh token on the backend
 * and clearing the local cookies.
 */
export async function logout() {
  try {
    await fetchWithAuth("/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Logout failed on backend:", error);
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("csrf_token");
    redirect("/login");
  }
}
