import { z } from "zod";
import { songIdParamsSchema } from "./song.js";

export const tabIdParamsSchema = songIdParamsSchema.extend({
  tabId: z.string().min(1),
});

const tabFieldsSchema = z.object({
  asciiTab: z.string().max(50_000).default(""),
  chordChart: z.string().max(50_000).default(""),
  capo: z.coerce.number().int().min(0).max(24).nullable().optional(),
  trackName: z
    .string()
    .trim()
    .max(50)
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});

export const createTabSchema = tabFieldsSchema.refine(
  (data) => Boolean(data.asciiTab.trim() || data.chordChart.trim()),
  { message: "At least one of asciiTab or chordChart is required" },
);

export const updateTabSchema = tabFieldsSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" },
);

export type CreateTabInput = z.infer<typeof createTabSchema>;
export type UpdateTabInput = z.infer<typeof updateTabSchema>;
