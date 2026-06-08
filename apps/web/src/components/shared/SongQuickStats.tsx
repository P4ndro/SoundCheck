import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";
import { formatBpm, formatDuration } from "@/lib/format";
import type { Song } from "@/types";

export interface SongQuickStatsProps {
  song: Song;
  showBadge?: boolean;
  variant?: "inline" | "split";
  className?: string;
}

export function SongQuickStats({
  song,
  showBadge = true,
  variant = "inline",
  className,
}: SongQuickStatsProps) {
  if (variant === "split") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-2",
          className,
        )}
      >
        <span className="font-mono text-xs text-subtle">
          {formatDuration(song.durationSeconds)} · {formatBpm(song.bpm)}
        </span>
        {showBadge && <StatusBadge status={song.status} />}
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <span className="font-mono text-xs text-subtle">
        {formatDuration(song.durationSeconds)}
      </span>
      <span className="text-xs text-subtle">·</span>
      <span className="font-mono text-xs text-subtle">
        {formatBpm(song.bpm)}
      </span>
      {showBadge && <StatusBadge status={song.status} />}
    </div>
  );
}
