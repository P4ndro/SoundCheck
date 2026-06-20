import type { SongStatus } from "@/types";

export interface CreateSongInput {
  title: string;
  bpm: number | null;
  timeSignature: string;
  durationSeconds: number;
  status: SongStatus;
  key: string;
  tuning: string;
  lyrics: string;
  notes: string;
}

export type UpdateSongInput = Partial<CreateSongInput>;
