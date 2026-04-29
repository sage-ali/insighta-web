"use client";

import { logout } from "@/features/auth/logout-action";

export function LogoutButton() {
  const handleLogout = () => {
    void logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-slate-900 text-white rounded-button font-medium hover:bg-slate-800 transition-colors"
    >
      Logout
    </button>
  );
}
