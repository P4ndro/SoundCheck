import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import {
  songStatusKanbanTitles,
  songStatusStyles,
  songStatusVariants,
  SONG_STATUSES,
} from "@/lib/song-status";
import type { SongStatus } from "@/types";
import {
  Calendar,
  Guitar,
  ListMusic,
  MessageCircle,
  Music2,
} from "lucide-react";

const navItems = [
  { icon: Music2, label: "Songs", active: true },
  { icon: Guitar, label: "Tabs", active: false },
  { icon: ListMusic, label: "Setlists", active: false },
  { icon: Calendar, label: "Calendar", active: false },
  { icon: MessageCircle, label: "Chat", active: false },
];

const songRows: {
  title: string;
  key: string;
  bpm: string;
  status: SongStatus;
  active?: boolean;
}[] = [
  { title: "Midnight Drive", key: "Am", bpm: "128", status: "in_progress", active: true },
  { title: "Neon Static", key: "Em", bpm: "142", status: "instrumental_ready" },
  { title: "Harbor Lights", key: "G", bpm: "96", status: "completed" },
];

const kanbanCounts = {
  not_started: 1,
  in_progress: 2,
  instrumental_ready: 1,
  completed: 3,
};

export function AppPreviewMock({ className }: { className?: string }) {
  return (
    <div className={cn("relative public-fade-up public-fade-up-delay-2", className)}>
      <div
        className="absolute -inset-px rounded-lg bg-accent/15 blur-md"
        aria-hidden
      />
      <div
        className={cn(
          "content-panel relative overflow-hidden",
          "shadow-[0_20px_60px_rgb(0_0_0/0.4),inset_0_1px_0_rgb(255_255_255/0.06)]",
        )}
        aria-hidden
      >
        <div className="flex h-[360px] sm:h-[400px]">
          <div className="flex w-[38%] shrink-0 flex-col border-r border-border bg-surface-1">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Soundcheck</p>
              <p className="text-xs text-subtle">The Marlowe</p>
            </div>
            <nav className="space-y-0.5 p-2">
              {navItems.map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors",
                    active
                      ? "bg-accent-subtle text-foreground ring-1 ring-accent/20"
                      : "text-muted",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {label}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex min-w-0 flex-1 flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Songs</p>
              <span className="rounded-full bg-surface-3 px-2 py-0.5 font-mono text-[10px] text-muted">
                8 tracks
              </span>
            </div>
            <div className="flex-1 space-y-0 p-3">
              {songRows.map((row) => {
                const style = songStatusStyles[row.status];
                return (
                  <div
                    key={row.title}
                    className={cn(
                      "relative flex items-center justify-between gap-3 rounded-md border px-2.5 py-2.5 transition-colors",
                      row.active
                        ? "border-accent/25 bg-accent-subtle/25"
                        : "border-transparent",
                    )}
                  >
                    {row.active && (
                      <span className="absolute top-2.5 bottom-2.5 left-0 w-0.5 rounded-full bg-accent" />
                    )}
                    <div className="flex min-w-0 items-start gap-2">
                      <span
                        className={cn(
                          "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                          style.dot,
                        )}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {row.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-subtle">
                          <span className="rounded bg-surface-3 px-1 py-px font-semibold text-accent-muted">
                            {row.key}
                          </span>
                          <span>{row.bpm} BPM</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={songStatusVariants[row.status]}
                      className="shrink-0 text-[10px]"
                    >
                      {songStatusKanbanTitles[row.status]}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-4 gap-1 border-t border-border-subtle bg-surface-1/50 p-2">
              {SONG_STATUSES.map((status) => {
                const style = songStatusStyles[status];
                return (
                  <div
                    key={status}
                    className={cn(
                      "rounded px-1 py-1.5 text-center",
                      style.kanbanColumn,
                    )}
                  >
                    <p
                      className={cn(
                        "truncate text-[8px] font-semibold tracking-wide uppercase",
                        style.kanbanHeader,
                      )}
                    >
                      {songStatusKanbanTitles[status].split(" ")[0]}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 inline-block rounded px-1 font-mono text-[9px]",
                        style.kanbanCount,
                      )}
                    >
                      {kanbanCounts[status]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
