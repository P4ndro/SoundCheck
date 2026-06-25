import { z } from "zod";

export const listChatMessagesQuerySchema = z.object({
  after: z.string().datetime({ offset: true }).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(100),
});

const cloudinaryImageUrlSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith("https://res.cloudinary.com/"), {
    message: "imageUrl must be a Cloudinary URL",
  });

export const createChatMessageSchema = z
  .object({
    text: z.string().trim().min(1).max(10_000).optional(),
    imageUrl: cloudinaryImageUrlSchema.optional(),
    imageCaption: z.string().trim().max(1_000).optional(),
  })
  .refine((data) => Boolean(data.text || data.imageUrl), {
    message: "Message text or imageUrl is required",
  });

export type ListChatMessagesQuery = z.infer<typeof listChatMessagesQuerySchema>;
export type CreateChatMessageInput = z.infer<typeof createChatMessageSchema>;
