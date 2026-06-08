import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type IconButtonTone = "default" | "danger";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: IconButtonTone;
  label: string;
}

const toneStyles: Record<IconButtonTone, string> = {
  default:
    "text-muted hover:bg-surface-3 hover:text-foreground",
  danger:
    "text-muted hover:bg-danger-subtle hover:text-danger",
};

export function IconButton({
  className,
  tone = "default",
  label,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150",
        "disabled:pointer-events-none disabled:opacity-40",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
