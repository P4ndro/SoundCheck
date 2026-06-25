import { z } from "zod";
import { bandIdParamsSchema } from "./song.js";

export const eventIdParamsSchema = bandIdParamsSchema.extend({
  eventId: z.string().min(1),
});

export const eventTypeSchema = z.enum(["rehearsal", "gig", "meeting"]);

const eventDateSchema = z
  .string()
  .datetime({ offset: true, message: "Invalid date-time" });

const eventFieldsSchema = z.object({
  title: z.string().trim().min(1).max(200),
  type: eventTypeSchema,
  start: eventDateSchema,
  end: eventDateSchema,
  location: z.string().trim().max(500).default(""),
  notes: z.string().max(10_000).default(""),
  setlistId: z.string().min(1).optional(),
});

function endAfterStart<T extends { start: string; end: string }>(
  schema: z.ZodType<T>,
) {
  return schema.refine((data) => new Date(data.end) > new Date(data.start), {
    message: "End must be after start",
    path: ["end"],
  });
}

export const createEventSchema = endAfterStart(eventFieldsSchema);

export const updateEventSchema = eventFieldsSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" },
);

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
