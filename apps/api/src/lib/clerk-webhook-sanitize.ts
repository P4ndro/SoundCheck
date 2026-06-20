import { z } from "zod";

const MAX_NAME_LENGTH = 120;
const MAX_IMAGE_URL_LENGTH = 2048;
const MAX_EMAIL_LENGTH = 254;

const controlChars = /[\u0000-\u001F\u007F]/g;

export function sanitizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH);
  if (!trimmed) return null;
  const result = z.string().email().safeParse(trimmed);
  return result.success ? result.data : null;
}

export function sanitizeName(
  firstName: unknown,
  lastName: unknown,
  fallback?: string,
): string {
  const parts = [firstName, lastName]
    .filter((part): part is string => typeof part === "string")
    .map((part) => part.replace(controlChars, "").trim())
    .filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" ").slice(0, MAX_NAME_LENGTH);
  }

  if (typeof fallback === "string") {
    const cleaned = fallback.replace(controlChars, "").trim();
    if (cleaned) return cleaned.slice(0, MAX_NAME_LENGTH);
  }

  return "Band member";
}

export function sanitizeImageUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().slice(0, MAX_IMAGE_URL_LENGTH);
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function sanitizeClerkId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!/^user_[a-zA-Z0-9]+$/.test(trimmed)) return null;
  return trimmed;
}

const emailAddressSchema = z.object({
  id: z.string(),
  email_address: z.string(),
});

export const clerkUserDataSchema = z.object({
  id: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  primary_email_address_id: z.string().nullable().optional(),
  email_addresses: z.array(emailAddressSchema).optional(),
});

export const clerkWebhookEventSchema = z.object({
  type: z.enum(["user.created", "user.updated", "user.deleted"]),
  data: clerkUserDataSchema,
});

export type ClerkWebhookEvent = z.infer<typeof clerkWebhookEventSchema>;

export function extractPrimaryEmail(data: z.infer<typeof clerkUserDataSchema>): string | null {
  const addresses = data.email_addresses ?? [];
  if (addresses.length === 0) return null;

  const primary = addresses.find((entry) => entry.id === data.primary_email_address_id);
  const candidate = primary?.email_address ?? addresses[0]?.email_address;
  return sanitizeEmail(candidate);
}
