import { cn } from "@/lib/cn";
import type { LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-medium text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
