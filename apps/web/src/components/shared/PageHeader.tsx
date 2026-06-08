import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface PageHeaderProps {
  /** Omit when the top app bar already shows the page title */
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  if (!title && !description && !actions) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          {description && (
            <p
              className={cn(
                "text-sm text-muted",
                title && "mt-1",
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
