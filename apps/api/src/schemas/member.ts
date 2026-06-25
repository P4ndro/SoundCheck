import { z } from "zod";
import { bandIdParamsSchema } from "./song.js";

export const memberUserIdParamsSchema = bandIdParamsSchema.extend({
  userId: z.string().min(1),
});
