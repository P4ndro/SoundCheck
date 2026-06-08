import type { BandEvent, Setlist, Song } from "@/types";

export function getUpcomingEvents(
  events: BandEvent[],
  limit?: number,
): BandEvent[] {
  const now = Date.now();
  const upcoming = [...events]
    .filter((event) => new Date(event.start).getTime() >= now)
    .sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getNextEvent(events: BandEvent[]): BandEvent | undefined {
  return getUpcomingEvents(events, 1)[0];
}

export function getActiveSetlist(
  events: BandEvent[],
  setlists: Setlist[],
  getSetlist: (id: string) => Setlist | undefined,
): Setlist | undefined {
  const next = getNextEvent(events);
  if (next?.setlistId) {
    const linked = getSetlist(next.setlistId);
    if (linked) return linked;
  }

  return [...setlists].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];
}

export function getRepertoireBreakdown(songs: Song[]) {
  const counts = {
    not_started: 0,
    in_progress: 0,
    instrumental_ready: 0,
    completed: 0,
  };

  for (const song of songs) {
    counts[song.status]++;
  }

  const total = songs.length;
  const stageReady = counts.instrumental_ready + counts.completed;
  const readyPercent = total > 0 ? Math.round((stageReady / total) * 100) : 0;

  return { counts, total, stageReady, readyPercent };
}

export function formatEventCountdown(iso: string): string {
  const start = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const diffDays = Math.round(
    (eventDay.getTime() - today.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 0) return "Past";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(start);
}
