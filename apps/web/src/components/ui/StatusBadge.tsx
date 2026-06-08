import type { SongStatus } from "@/types";
import {
  songStatusLabels,
  songStatusVariants,
} from "@/lib/song-status";
import { Badge } from "./Badge";

export interface StatusBadgeProps {
  status: SongStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={songStatusVariants[status]}>
      {songStatusLabels[status]}
    </Badge>
  );
}
