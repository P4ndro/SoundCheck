import { MetaItem } from "@/components/shared/MetaItem";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatBpm, formatDate, formatDuration } from "@/lib/format";
import type { Song } from "@/types";

export interface SongMetaStripProps {
  song: Song;
}

export function SongMetaStrip({ song }: SongMetaStripProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 px-4 py-3">
      <StatusBadge status={song.status} />
      {song.key && <MetaItem label="Key" value={song.key} mono />}
      {song.tuning && <MetaItem label="Tuning" value={song.tuning} mono />}
      <MetaItem label="Time" value={song.timeSignature} mono />
      <MetaItem label="BPM" value={formatBpm(song.bpm)} mono />
      <MetaItem
        label="Length"
        value={formatDuration(song.durationSeconds)}
        mono
      />
      <MetaItem label="Updated" value={formatDate(song.updatedAt)} />
    </div>
  );
}
