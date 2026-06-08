import { SongQuickStats } from "@/components/shared/SongQuickStats";
import { cn } from "@/lib/cn";
import { formatRelativeDate } from "@/lib/format";
import { statusCardHoverClass } from "@/lib/song-status";
import type { Song } from "@/types";
import { ChevronRight } from "lucide-react";

export interface SongCardProps {
  song: Song;
  onClick: () => void;
}

export function SongCard({ song, onClick }: SongCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border border-border bg-surface-1 p-4 text-left transition-all duration-150",
        statusCardHoverClass(song.status),
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {song.title}
        </p>
        <SongQuickStats song={song} className="mt-2" />
        <p className="mt-2 text-xs text-subtle">
          Updated {formatRelativeDate(song.updatedAt)}
        </p>
      </div>
      <ChevronRight className="ml-3 h-4 w-4 shrink-0 text-subtle" />
    </button>
  );
}
