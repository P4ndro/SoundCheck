import { z } from "zod";
import { bandIdParamsSchema } from "./song.js";

export const setlistIdParamsSchema = bandIdParamsSchema.extend({
  setlistId: z.string().min(1),
});

export const setlistItemParamsSchema = setlistIdParamsSchema.extend({
  songId: z.string().min(1),
});

export const createSetlistSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
});

export const updateSetlistSchema = createSetlistSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" },
);

export const addSetlistItemSchema = z.object({
  songId: z.string().min(1),
});

export const reorderSetlistItemsSchema = z.object({
  songIds: z.array(z.string().min(1)),
});

export type CreateSetlistInput = z.infer<typeof createSetlistSchema>;
export type UpdateSetlistInput = z.infer<typeof updateSetlistSchema>;
export type AddSetlistItemInput = z.infer<typeof addSetlistItemSchema>;
export type ReorderSetlistItemsInput = z.infer<typeof reorderSetlistItemsSchema>;
