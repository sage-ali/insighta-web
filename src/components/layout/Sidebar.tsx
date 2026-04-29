"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "HomeIcon" },
  { name: "Profiles", href: "/profiles", icon: "UsersIcon" },
  { name: "Search", href: "/search", icon: "MagnifyingGlassIcon" },
  { name: "Account", href: "/account", icon: "UserCircleIcon" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 border-r border-border-subtle bg-white min-h-screen">
      <div className="flex items-center h-16 px-6 border-b border-border-subtle">
        <span className="text-title-lg text-primary">Insighta Labs+</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-body-md rounded-button transition-colors",
                isActive
                  ? "bg-slate-100 text-primary font-medium"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border-subtle">
        <UserMenu />
      </div>
    </div>
  );
}
