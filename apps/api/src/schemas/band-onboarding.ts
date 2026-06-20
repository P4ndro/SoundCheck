import { z } from "zod";

export const createBandSchema = z.object({
  name: z.string().trim().min(2, "Band name must be at least 2 characters").max(80),
});

export const joinBandSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, "Invite code is too short")
    .max(32, "Invite code is too long"),
});

export type CreateBandInput = z.infer<typeof createBandSchema>;
export type JoinBandInput = z.infer<typeof joinBandSchema>;
