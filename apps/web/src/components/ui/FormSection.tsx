import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn("space-y-2.5", className)}>
      <div className="px-0.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-3.5 rounded-lg border border-border/80 bg-surface-1/60 p-3.5">
        {children}
      </div>
    </section>
  );
}
