import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

export type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function NativeSelect({ className, children, ...props }: NativeSelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-9 w-full appearance-none rounded-md border border-border bg-surface-1 px-3 pr-9 text-sm text-foreground",
          "hover:border-border-subtle",
          "focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-subtle",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-subtle"
        aria-hidden
      />
    </div>
  );
}
