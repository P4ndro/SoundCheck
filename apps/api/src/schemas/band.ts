import { z } from "zod";
import { bandIdParamsSchema } from "./song.js";

export const updateBandSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export type UpdateBandInput = z.infer<typeof updateBandSchema>;

export { bandIdParamsSchema };
