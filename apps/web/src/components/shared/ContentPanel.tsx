import { cn } from "@/lib/cn";
import type { ReactNode, RefObject } from "react";

export interface ContentPanelProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  bodyRef?: RefObject<HTMLDivElement | null>;
  fill?: boolean;
}

export function ContentPanel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  bodyRef,
  fill = false,
}: ContentPanelProps) {
  return (
    <div
      className={cn(
        "content-panel overflow-hidden",
        fill && "flex min-h-0 flex-col",
        className,
      )}
    >
      {(title || actions) && (
        <div className="content-panel-header shrink-0">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-subtle">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div
        ref={bodyRef}
        className={cn(
          "p-4",
          fill && "flex min-h-0 flex-1 flex-col overflow-hidden",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
