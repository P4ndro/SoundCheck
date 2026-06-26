import { BrandMark } from "@/components/layout/BrandMark";
import { PublicPageBackdrop } from "@/features/auth/components/PublicPageBackdrop";
import { cn } from "@/lib/cn";
import { songStatusStyles } from "@/lib/song-status";
import type { SongStatus } from "@/types";
import type { ReactNode } from "react";

export interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  variant?: "default" | "clerk";
}

const asidePoints: { text: string; accent: SongStatus | "accent" }[] = [
  {
    text: "Song library with workflow status for the whole band",
    accent: "in_progress",
  },
  {
    text: "Setlists linked to gigs and rehearsals on the calendar",
    accent: "completed",
  },
  {
    text: "Role-based notation view and internal band chat",
    accent: "instrumental_ready",
  },
];

function bulletClass(accent: SongStatus | "accent"): string {
  if (accent === "accent") return "bg-accent";
  return songStatusStyles[accent].dot;
}

export function AuthShell({
  title,
  description,
  children,
  footer,
  className,
  variant = "default",
}: AuthShellProps) {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-y-auto bg-background">
      <PublicPageBackdrop className="opacity-80" />

      <div className="relative flex flex-1 flex-col lg:flex-row">
        <aside className="hidden border-r border-border bg-surface-1/90 backdrop-blur-sm lg:flex lg:w-[420px] lg:shrink-0 lg:flex-col lg:justify-between lg:p-10">
          <BrandMark subtitle="Band workspace" />

          <div className="space-y-6">
            <p className="text-2xl font-semibold leading-snug tracking-tight text-foreground">
              Rehearsals, setlists, and tabs —{" "}
              <span className="text-accent-muted">kept in one place.</span>
            </p>
            <ul className="space-y-3 text-sm text-muted">
              {asidePoints.map(({ text, accent }) => (
                <li key={text} className="flex gap-2.5">
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      bulletClass(accent),
                    )}
                  />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-subtle">
            Built for working bands — not another generic project tool.
          </p>
        </aside>

        <main
          className={cn(
            "flex flex-1 flex-col items-center justify-center px-6 py-10",
            className,
          )}
        >
          <div className="public-fade-up mb-8 lg:hidden">
            <BrandMark subtitle="Band workspace" />
          </div>

          <div className="public-fade-up public-fade-up-delay-1 w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-1.5 text-sm text-muted">{description}</p>
            </div>

            <div
              className={cn(
                "content-panel shadow-[0_16px_48px_rgb(0_0_0/0.25)]",
                variant === "clerk"
                  ? "auth-clerk-panel overflow-visible px-5 pb-5 pt-7 sm:px-6 sm:pb-6 sm:pt-8"
                  : "p-6",
              )}
            >
              {children}
            </div>

            {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
