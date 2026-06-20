import { z } from "zod";

const bandRoleSchema = z.enum([
  "bass",
  "drums",
  "vocals",
  "lead_guitar",
  "rhythm_guitar",
  "custom",
]);

export const updateProfileSchema = z
  .object({
    primaryRole: bandRoleSchema,
    customRoleLabel: z.string().trim().max(50).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.primaryRole === "custom" && !data.customRoleLabel?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "customRoleLabel is required when primaryRole is custom",
        path: ["customRoleLabel"],
      });
    }
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
