import { z } from "zod";

export const bandIdParamsSchema = z.object({
  bandId: z.string().min(1),
});

export const songIdParamsSchema = bandIdParamsSchema.extend({
  songId: z.string().min(1),
});

export const songStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "instrumental_ready",
  "completed",
]);

export const createSongSchema = z.object({
  title: z.string().trim().min(1).max(200),
  bpm: z.number().int().positive().max(400).nullable(),
  timeSignature: z.string().trim().min(1).max(16).default("4/4"),
  durationSeconds: z.number().int().min(0).max(86400),
  status: songStatusSchema.default("not_started"),
  key: z.string().trim().max(32).default(""),
  tuning: z.string().trim().max(64).default(""),
  lyrics: z.string().max(50_000).default(""),
  notes: z.string().max(10_000).default(""),
});

export const updateSongSchema = createSongSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" },
);

export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongInput = z.infer<typeof updateSongSchema>;
