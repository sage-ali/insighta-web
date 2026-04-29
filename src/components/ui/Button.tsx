import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive";
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    destructive: "bg-rose-500 text-white hover:bg-rose-600",
  };

  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 font-medium transition-all active:scale-95",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
