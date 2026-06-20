import {
  extractPrimaryEmail,
  sanitizeClerkId,
  sanitizeImageUrl,
  sanitizeName,
  type ClerkWebhookEvent,
} from "../lib/clerk-webhook-sanitize.js";
import { prisma } from "../lib/prisma.js";

function createUserId(): string {
  return `user-${crypto.randomUUID().slice(0, 8)}`;
}

export async function syncClerkUserFromWebhook(
  event: ClerkWebhookEvent,
): Promise<void> {
  const clerkId = sanitizeClerkId(event.data.id);
  if (!clerkId) {
    throw new Error("Invalid clerk_id in webhook payload");
  }

  if (event.type === "user.deleted") {
    await prisma.user.updateMany({
      where: { clerkId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return;
  }

  const email = extractPrimaryEmail(event.data);
  if (!email) {
    throw new Error("No valid primary email in webhook payload");
  }

  const name = sanitizeName(
    event.data.first_name,
    event.data.last_name,
    event.data.username ?? undefined,
  );
  const avatarUrl = sanitizeImageUrl(event.data.image_url);
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { clerkId } });

    if (existing) {
      await tx.user.update({
        where: { clerkId },
        data: {
          email,
          name,
          avatarUrl,
          deletedAt: null,
          updatedAt: now,
        },
      });
      return;
    }

    const byEmail = await tx.user.findUnique({ where: { email } });

    if (byEmail) {
      await tx.user.update({
        where: { id: byEmail.id },
        data: {
          clerkId,
          name,
          avatarUrl,
          deletedAt: null,
          updatedAt: now,
        },
      });
      return;
    }

    await tx.user.create({
      data: {
        id: createUserId(),
        clerkId,
        email,
        name,
        avatarUrl,
        deletedAt: null,
      },
    });
  });
}
