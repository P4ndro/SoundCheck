import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  className?: string;
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border px-6 py-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <SearchInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label="Filter search"
        containerClassName="w-full sm:max-w-xs"
      />
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}
