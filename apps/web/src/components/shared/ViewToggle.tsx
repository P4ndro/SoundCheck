import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

export interface ViewToggleOption<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
}

export interface ViewToggleProps<T extends string> {
  value: T;
  options: ViewToggleOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function ViewToggle<T extends string>({
  value,
  options,
  onChange,
  className,
}: ViewToggleProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex rounded-md border border-border bg-surface-1 p-0.5",
        className,
      )}
      role="group"
    >
      {options.map(({ value: optionValue, label, icon: Icon }) => {
        const isActive = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent-subtle text-foreground"
                : "text-muted hover:text-foreground",
            )}
            aria-pressed={isActive}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
