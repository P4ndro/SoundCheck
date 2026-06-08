import { SongQuickStats } from "@/components/shared/SongQuickStats";
import { cn } from "@/lib/cn";
import {
  songStatusKanbanTitles,
  songStatusStyles,
  SONG_STATUSES,
  statusCardHoverClass,
} from "@/lib/song-status";
import type { Song, SongStatus } from "@/types";

export interface KanbanBoardProps {
  songs: Song[];
  onSongClick: (song: Song) => void;
  className?: string;
}

export function KanbanBoard({ songs, onSongClick, className }: KanbanBoardProps) {
  const grouped = SONG_STATUSES.reduce<Record<SongStatus, Song[]>>(
    (acc, status) => {
      acc[status] = songs.filter((song) => song.status === status);
      return acc;
    },
    {
      not_started: [],
      in_progress: [],
      instrumental_ready: [],
      completed: [],
    },
  );

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {SONG_STATUSES.map((status) => {
        const style = songStatusStyles[status];

        return (
          <div key={status} className="flex min-w-0 flex-col">
            <div className="mb-3 flex items-center justify-between gap-2 px-1">
              <div className="flex min-w-0 items-center gap-2">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", style.dot)} />
                <h3
                  className={cn(
                    "truncate text-xs font-semibold tracking-wide uppercase",
                    style.kanbanHeader,
                  )}
                >
                  {songStatusKanbanTitles[status]}
                </h3>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
                  style.kanbanCount,
                )}
              >
                {grouped[status].length}
              </span>
            </div>
            <div
              className={cn(
                "flex flex-1 flex-col gap-2 rounded-lg bg-surface-1 p-2",
                style.kanbanColumn,
              )}
            >
              {grouped[status].map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => onSongClick(song)}
                  className={cn(
                    "rounded-md border border-border bg-surface-2 p-3 text-left transition-all duration-150",
                    statusCardHoverClass(status),
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {song.title}
                  </p>
                  <SongQuickStats
                    song={song}
                    variant="split"
                    className="mt-2"
                  />
                </button>
              ))}
              {grouped[status].length === 0 && (
                <div className="rounded-md border border-dashed border-border px-3 py-8 text-center text-xs text-subtle">
                  No songs
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
