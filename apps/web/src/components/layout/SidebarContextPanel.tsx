import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import { cn } from "@/lib/cn";
import { eventTypeLabels } from "@/lib/event-type";
import { formatTime } from "@/lib/format";
import {
  formatEventCountdown,
  getActiveSetlist,
  getNextEvent,
  getRepertoireBreakdown,
} from "@/lib/sidebar-insights";
import { songStatusStyles } from "@/lib/song-status";
import type { EventType } from "@/types";
import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";

const eventDot: Record<EventType, string> = {
  rehearsal: "bg-violet-300",
  gig: "bg-emerald-400",
  meeting: "bg-zinc-400",
};

function ContextRow({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={href}
      className="block rounded-lg px-2 py-2 transition-colors hover:bg-surface-2/80"
    >
      <p className="text-[11px] font-medium tracking-wide text-subtle uppercase">
        {label}
      </p>
      <div className="mt-0.5">{children}</div>
    </Link>
  );
}

export function SidebarContextPanel({ collapsed }: { collapsed: boolean }) {
  const { songs, events, setlists, getSetlist } = useBandWorkspace();

  const nextEvent = useMemo(() => getNextEvent(events), [events]);
  const activeSetlist = useMemo(
    () => getActiveSetlist(events, setlists, getSetlist),
    [events, setlists, getSetlist],
  );
  const repertoire = useMemo(() => getRepertoireBreakdown(songs), [songs]);

  if (collapsed) return null;

  return (
    <div className="shrink-0 space-y-1 border-t border-border-subtle px-3 py-3">
      <ContextRow label="Next up" href="/calendar">
        {nextEvent ? (
          <>
            <div className="flex items-center gap-1.5">
              <span
                className={cn("h-1.5 w-1.5 shrink-0 rounded-full", eventDot[nextEvent.type])}
              />
              <p className="truncate text-sm font-medium text-foreground">
                {nextEvent.title}
              </p>
            </div>
            <p className="mt-0.5 truncate text-xs text-subtle">
              {formatEventCountdown(nextEvent.start)} · {formatTime(nextEvent.start)}
              {" · "}
              {eventTypeLabels[nextEvent.type]}
            </p>
          </>
        ) : (
          <p className="text-xs text-subtle">Nothing scheduled</p>
        )}
      </ContextRow>

      <ContextRow label="Repertoire" href="/songs">
        <div className="flex items-center gap-2">
          {repertoire.total > 0 && (
            <div className="flex h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
              {(
                [
                  "not_started",
                  "in_progress",
                  "instrumental_ready",
                  "completed",
                ] as const
              ).map((status) => {
                const count = repertoire.counts[status];
                if (count === 0) return null;
                return (
                  <div
                    key={status}
                    className={cn(songStatusStyles[status].bar, "h-full")}
                    style={{ width: `${(count / repertoire.total) * 100}%` }}
                  />
                );
              })}
            </div>
          )}
          <span className="shrink-0 text-xs font-mono text-muted">
            {repertoire.stageReady}/{repertoire.total}
          </span>
        </div>
      </ContextRow>

      {activeSetlist && (
        <ContextRow
          label="Active setlist"
          href={`/setlists/${activeSetlist.id}`}
        >
          <p className="truncate text-sm font-medium text-foreground">
            {activeSetlist.name}
          </p>
          <p className="mt-0.5 text-xs text-subtle">
            {activeSetlist.songIds.length} songs
          </p>
        </ContextRow>
      )}
    </div>
  );
}
