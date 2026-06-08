import { cn } from "@/lib/cn";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export interface DetailBackLinkProps {
  to: string;
  label: string;
  currentTitle?: string;
  className?: string;
}

export function DetailBackLink({
  to,
  label,
  currentTitle,
  className,
}: DetailBackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "mb-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
      {currentTitle && (
        <>
          <span className="text-subtle">/</span>
          <span className="text-foreground">{currentTitle}</span>
        </>
      )}
    </Link>
  );
}
