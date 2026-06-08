import { MetaItem } from "@/components/shared/MetaItem";
import { cn } from "@/lib/cn";
import { formatBpm, formatDuration } from "@/lib/format";
import type { Song } from "@/types";

export interface NotationMetaBarProps {
  song: Song;
  instrumentLabel?: string;
  capo?: number;
  className?: string;
}

export function NotationMetaBar({
  song,
  instrumentLabel,
  capo,
  className,
}: NotationMetaBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 px-4 py-3",
        className,
      )}
    >
      {instrumentLabel && (
        <span className="rounded-md border border-accent/30 bg-accent-subtle px-2.5 py-1 text-xs font-semibold text-accent-muted">
          {instrumentLabel}
        </span>
      )}
      {song.key && <MetaItem label="Key" value={song.key} mono />}
      {song.tuning && <MetaItem label="Tuning" value={song.tuning} mono />}
      {capo != null && capo > 0 && (
        <MetaItem label="Capo" value={`Fret ${capo}`} mono />
      )}
      <MetaItem label="Time" value={song.timeSignature} mono />
      <MetaItem label="BPM" value={formatBpm(song.bpm)} mono />
      <MetaItem
        label="Length"
        value={formatDuration(song.durationSeconds)}
        mono
      />
    </div>
  );
}
