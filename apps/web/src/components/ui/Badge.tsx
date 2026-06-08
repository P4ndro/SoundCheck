import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "neutral"
  | "warning"
  | "info"
  | "success"
  | "accent";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-status-neutral/20 text-muted border-status-neutral/30",
  warning: "bg-status-warning/15 text-amber-300 border-status-warning/30",
  info: "bg-rose-500/14 text-rose-200 border-rose-400/35",
  success: "bg-status-success/15 text-green-300 border-status-success/30",
  accent: "bg-accent-subtle text-accent-muted border-accent/50",
};

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
