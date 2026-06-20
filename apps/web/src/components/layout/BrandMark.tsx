import { cn } from "@/lib/cn";
import { AudioLines } from "lucide-react";
import { Link } from "react-router-dom";

export interface BrandMarkProps {
  subtitle?: string;
  className?: string;
  /** When set, the mark links to this route (e.g. `/`). */
  href?: string;
  size?: "sm" | "md";
}

export function BrandMark({
  subtitle,
  className,
  href = "/",
  size = "md",
}: BrandMarkProps) {
  const iconSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconInner = "h-4 w-4";
  const titleClass = size === "sm" ? "text-sm" : "text-base";

  const content = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2",
          iconSize,
        )}
      >
        <AudioLines className={cn(iconInner, "text-accent-muted")} strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className={cn("block font-semibold text-foreground", titleClass)}>
          Soundcheck
        </span>
        {subtitle && (
          <span className="block truncate text-xs text-subtle">{subtitle}</span>
        )}
      </span>
    </>
  );

  const rootClass = cn("inline-flex min-w-0 items-center gap-2.5", className);

  if (href) {
    return (
      <Link to={href} className={cn(rootClass, "transition-opacity hover:opacity-90")}>
        {content}
      </Link>
    );
  }

  return <div className={rootClass}>{content}</div>;
}
