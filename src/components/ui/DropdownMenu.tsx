"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  trigger?: React.ReactNode;
  className?: string;
}

export function DropdownMenu({ items, trigger, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("relative inline-block text-left", className)}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors",
                    item.onClick ? "cursor-pointer" : "cursor-default",
                  )}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
