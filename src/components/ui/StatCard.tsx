import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, trend = "neutral" }: StatCardProps) {
  const trendColor = {
    up: "text-emerald-500",
    down: "text-rose-500",
    neutral: "text-slate-400",
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
      <p className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-3xl font-semibold">{value}</p>
        {trend !== "neutral" && (
          <svg
            className={cn("h-5 w-5", trendColor[trend])}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={trend === "up" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
