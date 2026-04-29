import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  pill?: boolean;
}

export function SearchInput({
  pill = false,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        className={cn(
          "block w-full rounded-lg border-0 py-1.5 pl-10 pr-4 text-slate-900 ring-2 ring-primary placeholder:text-slate-400 focus:ring-2 focus:ring-primary",
          pill ? "rounded-full" : "rounded-lg",
          className,
        )}
        {...props}
      />
    </div>
  );
}
