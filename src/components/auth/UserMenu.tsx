"use client";

import { useAuth } from "./AuthProvider";
import { UserAvatar } from "./UserAvatar";
import { DropdownMenu } from "../ui/DropdownMenu";

export function UserMenu() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 bg-slate-200 rounded" />
          <div className="h-2 w-16 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleBadgeClass = (role: string) => {
    return role === "ADMIN"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";
  };

  const menuItems = [
    {
      label: "Account Settings",
      onClick: () => (window.location.href = "/account"),
    },
    {
      label: "Logout",
      onClick: logout,
    },
  ];

  const trigger = (
    <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-slate-100 transition-colors">
      <UserAvatar src={user.avatarUrl} name={user.username} size="md" />
      <div className="flex flex-col items-start flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-900 truncate w-full">
          {user.username}
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${getRoleBadgeClass(user.role)}`}
        >
          {user.role}
        </span>
      </div>
    </button>
  );

  return <DropdownMenu items={menuItems} trigger={trigger} />;
}
