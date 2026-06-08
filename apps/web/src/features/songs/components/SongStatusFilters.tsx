import {
  songStatusLabels,
  SONG_STATUSES,
  statusFilterChipClass,
} from "@/lib/song-status";
import type { SongStatus } from "@/types";

export interface SongStatusFiltersProps {
  active: SongStatus | "all";
  onChange: (status: SongStatus | "all") => void;
}

export function SongStatusFilters({ active, onChange }: SongStatusFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={statusFilterChipClass("all", active === "all")}
      >
        All
      </button>
      {SONG_STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={statusFilterChipClass(status, active === status)}
        >
          {songStatusLabels[status]}
        </button>
      ))}
    </div>
  );
}
