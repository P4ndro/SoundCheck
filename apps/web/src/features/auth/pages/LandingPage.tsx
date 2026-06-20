import { PublicHeader } from "@/features/auth/components/PublicHeader";
import { AppPreviewMock } from "@/features/auth/components/AppPreviewMock";
import { PublicPageBackdrop } from "@/features/auth/components/PublicPageBackdrop";
import { WorkflowStatusStrip } from "@/features/auth/components/WorkflowStatusStrip";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { statusCardHoverClass } from "@/lib/song-status";
import type { SongStatus } from "@/types";
import {
  Calendar,
  Guitar,
  ListMusic,
  MessageCircle,
  Music2,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type FeatureAccent = SongStatus | "accent";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: FeatureAccent;
}[] = [
  {
    icon: Music2,
    title: "Song library",
    description:
      "Track status from idea to stage-ready. Filter, search, and kanban view for the whole repertoire.",
    accent: "in_progress",
  },
  {
    icon: ListMusic,
    title: "Setlists",
    description:
      "Build gig and rehearsal sets, reorder on the fly, and tie them to calendar events.",
    accent: "accent",
  },
  {
    icon: Calendar,
    title: "Calendar",
    description:
      "Rehearsals, gigs, and meetings in one schedule — with setlists attached where it matters.",
    accent: "not_started",
  },
  {
    icon: Guitar,
    title: "Role-based tabs",
    description:
      "Each member sees their instrument part. Switch songs and parts without digging through files.",
    accent: "instrumental_ready",
  },
  {
    icon: MessageCircle,
    title: "Band chat",
    description:
      "Quick coordination in-context — messages and photos without leaving the workspace.",
    accent: "completed",
  },
];

function featureIconBoxClass(accent: FeatureAccent): string {
  switch (accent) {
    case "accent":
      return "border-accent/35 bg-accent-subtle/40";
    case "not_started":
      return "border-status-neutral/40 bg-status-neutral/20";
    case "in_progress":
      return "border-status-warning/35 bg-status-warning/15";
    case "instrumental_ready":
      return "border-rose-400/35 bg-rose-500/14";
    case "completed":
      return "border-status-success/35 bg-status-success/15";
  }
}

function featureCardHoverClass(accent: FeatureAccent): string {
  if (accent === "accent") return "hover:border-accent/40 hover:bg-surface-1";
  return statusCardHoverClass(accent);
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-y-auto bg-background">
      <PublicPageBackdrop />
      <PublicHeader />

      <section className="relative mx-auto grid w-full max-w-6xl flex-1 gap-12 px-6 py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <div className="public-fade-up">
          <p className="font-mono text-xs font-medium tracking-wide text-accent-muted uppercase">
            Collaborative band hub
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1]">
            Everything your band needs{" "}
            <span className="text-accent-muted">between rehearsals.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
            Soundcheck keeps songs, setlists, calendar, notation, and chat in
            one workspace — so you spend less time coordinating and more time
            playing.
          </p>

          <WorkflowStatusStrip className="mt-7" />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Create band account
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
          <p className="mt-6 text-xs text-subtle">
            Free to try with your band. No credit card for the demo workspace.
          </p>
        </div>

        <AppPreviewMock className="mx-auto w-full max-w-lg lg:max-w-none" />
      </section>

      <section className="relative border-t border-border bg-surface-1">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Built for how bands actually work
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Not a generic notes app with a music skin. Modules map to real
              rehearsal workflows — from learning a part to running the Friday
              gig set.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, accent }) => (
                <li
                  key={title}
                  className={cn(
                    "group rounded-lg border border-border bg-background p-5 transition-all duration-150",
                    featureCardHoverClass(accent),
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md border transition-colors",
                      featureIconBoxClass(accent),
                    )}
                  >
                    <Icon
                      className="h-4 w-4 text-accent-muted"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {description}
                  </p>
                </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Ready to run your next rehearsal from one place?
            </h2>
            <p className="mt-1 text-sm text-muted">
              Set up your band workspace in a few minutes.
            </p>
          </div>
          <Button size="lg" onClick={() => navigate("/signup")}>
            Get started
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6">
        <p className="mx-auto max-w-6xl text-xs text-subtle">
          Soundcheck — university project. Sign up to create or join a band
          workspace.
        </p>
      </footer>
    </div>
  );
}
