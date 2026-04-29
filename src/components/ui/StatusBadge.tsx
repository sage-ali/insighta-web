import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
}

const statusColors = {
  success: "text-emerald-500 bg-emerald-500/10",
  error: "text-rose-500 bg-rose-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  info: "text-blue-500 bg-blue-500/10",
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs",
        statusColors[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
