import type { BadgeVariant } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { SongStatus } from "@/types";

export const SONG_STATUSES: SongStatus[] = [
  "not_started",
  "in_progress",
  "instrumental_ready",
  "completed",
];

export const songStatusLabels: Record<SongStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  instrumental_ready: "Instrumental ready",
  completed: "Completed",
};

export const songStatusVariants: Record<SongStatus, BadgeVariant> = {
  not_started: "neutral",
  in_progress: "warning",
  instrumental_ready: "info",
  completed: "success",
};

export const songStatusKanbanTitles = songStatusLabels;

export interface SongStatusStyle {
  dot: string;
  bar: string;
  filterIdle: string;
  filterHover: string;
  filterActive: string;
  cardHover: string;
  rowHover: string;
  kanbanHeader: string;
  kanbanCount: string;
  kanbanColumn: string;
}

export const songStatusStyles: Record<SongStatus, SongStatusStyle> = {
  not_started: {
    dot: "bg-status-neutral",
    bar: "bg-status-neutral/70",
    filterIdle: "border-border bg-surface-1 text-muted",
    filterHover:
      "hover:border-status-neutral/45 hover:bg-status-neutral/18 hover:text-foreground",
    filterActive:
      "border-status-neutral/55 bg-status-neutral/25 text-foreground",
    cardHover:
      "hover:border-status-neutral/45 hover:bg-status-neutral/12",
    rowHover:
      "hover:border-status-neutral/40 hover:bg-status-neutral/14",
    kanbanHeader: "text-muted",
    kanbanCount: "bg-status-neutral/20 text-muted border border-status-neutral/30",
    kanbanColumn:
      "border-border border-t-2 border-t-status-neutral/70",
  },
  in_progress: {
    dot: "bg-status-warning",
    bar: "bg-status-warning/80",
    filterIdle: "border-border bg-surface-1 text-muted",
    filterHover:
      "hover:border-status-warning/50 hover:bg-status-warning/18 hover:text-amber-200",
    filterActive:
      "border-status-warning/55 bg-status-warning/25 text-amber-100",
    cardHover:
      "hover:border-status-warning/50 hover:bg-status-warning/12",
    rowHover:
      "hover:border-status-warning/45 hover:bg-status-warning/14",
    kanbanHeader: "text-amber-300",
    kanbanCount:
      "bg-status-warning/18 text-amber-300 border border-status-warning/35",
    kanbanColumn:
      "border-border border-t-2 border-t-status-warning/80",
  },
  instrumental_ready: {
    dot: "bg-rose-400",
    bar: "bg-rose-400/75",
    filterIdle: "border-border bg-surface-1 text-muted",
    filterHover:
      "hover:border-rose-400/45 hover:bg-rose-500/14 hover:text-rose-200",
    filterActive: "border-rose-400/50 bg-rose-500/20 text-rose-100",
    cardHover: "hover:border-rose-400/45 hover:bg-rose-500/10",
    rowHover: "hover:border-rose-400/40 hover:bg-rose-500/12",
    kanbanHeader: "text-rose-300",
    kanbanCount:
      "bg-rose-500/14 text-rose-300 border border-rose-400/30",
    kanbanColumn: "border-border border-t-2 border-t-rose-400/70",
  },
  completed: {
    dot: "bg-status-success",
    bar: "bg-status-success/80",
    filterIdle: "border-border bg-surface-1 text-muted",
    filterHover:
      "hover:border-status-success/50 hover:bg-status-success/18 hover:text-green-200",
    filterActive:
      "border-status-success/55 bg-status-success/25 text-green-100",
    cardHover:
      "hover:border-status-success/50 hover:bg-status-success/12",
    rowHover:
      "hover:border-status-success/45 hover:bg-status-success/14",
    kanbanHeader: "text-green-300",
    kanbanCount:
      "bg-status-success/18 text-green-300 border border-status-success/35",
    kanbanColumn:
      "border-border border-t-2 border-t-status-success/80",
  },
};

const filterChipBase =
  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors";

export function statusFilterChipClass(
  status: SongStatus | "all",
  active: boolean,
): string {
  if (status === "all") {
    return cn(
      filterChipBase,
      active
        ? "border-border bg-surface-3 text-foreground"
        : "border-border bg-surface-1 text-muted hover:bg-surface-2 hover:text-foreground",
    );
  }

  const style = songStatusStyles[status];
  return cn(
    filterChipBase,
    active ? style.filterActive : [style.filterIdle, style.filterHover],
  );
}

export function statusCardHoverClass(status: SongStatus): string {
  return songStatusStyles[status].cardHover;
}

export function statusRowHoverClass(status: SongStatus): string {
  return songStatusStyles[status].rowHover;
}
