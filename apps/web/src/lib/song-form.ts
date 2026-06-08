import { parseDurationInput, splitDuration } from "@/lib/duration-input";
import type { Song, SongStatus } from "@/types";

export interface SongFormValues {
  title: string;
  key: string;
  tuning: string;
  bpm: string;
  timeSignature: string;
  durationMinutes: string;
  durationSeconds: string;
  status: SongStatus;
  lyrics: string;
  notes: string;
}

export function emptySongForm(): SongFormValues {
  return {
    title: "",
    key: "",
    tuning: "",
    bpm: "",
    timeSignature: "4/4",
    durationMinutes: "3",
    durationSeconds: "30",
    status: "not_started",
    lyrics: "",
    notes: "",
  };
}

export function songToFormValues(song: Song): SongFormValues {
  const { minutes, seconds } = splitDuration(song.durationSeconds);
  return {
    title: song.title,
    key: song.key,
    tuning: song.tuning,
    bpm: song.bpm != null ? String(song.bpm) : "",
    timeSignature: song.timeSignature,
    durationMinutes: minutes,
    durationSeconds: seconds,
    status: song.status,
    lyrics: song.lyrics,
    notes: song.notes,
  };
}

export function formValuesToSongPayload(values: SongFormValues) {
  const bpm = values.bpm.trim() ? parseInt(values.bpm, 10) : null;
  return {
    title: values.title.trim(),
    key: values.key.trim(),
    tuning: values.tuning.trim(),
    bpm: bpm && !Number.isNaN(bpm) ? bpm : null,
    timeSignature: values.timeSignature.trim() || "4/4",
    durationSeconds: parseDurationInput(
      values.durationMinutes,
      values.durationSeconds,
    ),
    status: values.status,
    lyrics: values.lyrics.trim(),
    notes: values.notes.trim(),
  };
}
