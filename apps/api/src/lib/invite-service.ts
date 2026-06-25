import { env } from "../config/env.js";
import { generateInviteCode } from "./invite-code.js";
import { prisma } from "./prisma.js";
import { ApiError } from "../middleware/error-handler.js";
import type { BandInvite, Prisma } from "@prisma/client";

export const INVALID_INVITE_MESSAGE = "Invalid or expired invite code";

type InviteRecord = Pick<
  BandInvite,
  "id" | "code" | "expiresAt" | "maxUses" | "useCount"
>;

export function isInviteActive(invite: InviteRecord, now = new Date()): boolean {
  if (invite.expiresAt && invite.expiresAt <= now) {
    return false;
  }

  if (invite.maxUses != null && invite.useCount >= invite.maxUses) {
    return false;
  }

  return true;
}

export function buildInviteShareUrl(code: string): string {
  const origin = env.CORS_ORIGIN.replace(/\/$/, "");
  return `${origin}/join?code=${encodeURIComponent(code)}`;
}

export function serializeBandInvite(invite: InviteRecord) {
  const active = isInviteActive(invite);

  return {
    code: invite.code,
    shareUrl: buildInviteShareUrl(invite.code),
    status: active ? ("active" as const) : ("expired" as const),
  };
}

export async function createBandInvite(
  tx: Prisma.TransactionClient,
  bandId: string,
  createdBy: string,
): Promise<InviteRecord> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateInviteCode();

    try {
      return await tx.bandInvite.create({
        data: {
          id: `invite-${crypto.randomUUID().slice(0, 8)}`,
          bandId,
          code,
          createdBy,
        },
        select: {
          id: true,
          code: true,
          expiresAt: true,
          maxUses: true,
          useCount: true,
        },
      });
    } catch {
      if (attempt === 4) {
        throw new ApiError(500, "Could not generate invite code");
      }
    }
  }

  throw new ApiError(500, "Could not generate invite code");
}

export async function findActiveInvite(
  bandId: string,
): Promise<InviteRecord | null> {
  const invites = await prisma.bandInvite.findMany({
    where: { bandId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      expiresAt: true,
      maxUses: true,
      useCount: true,
    },
  });

  return invites.find((invite) => isInviteActive(invite)) ?? null;
}

export async function getOrCreateActiveInvite(
  bandId: string,
  createdBy: string,
): Promise<InviteRecord> {
  const existing = await findActiveInvite(bandId);
  if (existing) {
    return existing;
  }

  return prisma.$transaction(async (tx) => {
    const invites = await tx.bandInvite.findMany({
      where: { bandId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        expiresAt: true,
        maxUses: true,
        useCount: true,
      },
    });

    const active = invites.find((invite) => isInviteActive(invite));
    if (active) {
      return active;
    }

    return createBandInvite(tx, bandId, createdBy);
  });
}

export async function regenerateActiveInvite(
  bandId: string,
  createdBy: string,
): Promise<InviteRecord> {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const invites = await tx.bandInvite.findMany({
      where: { bandId },
      select: {
        id: true,
        code: true,
        expiresAt: true,
        maxUses: true,
        useCount: true,
      },
    });

    const activeInviteIds = invites
      .filter((invite) => isInviteActive(invite, now))
      .map((invite) => invite.id);

    if (activeInviteIds.length > 0) {
      await tx.bandInvite.updateMany({
        where: { id: { in: activeInviteIds } },
        data: { expiresAt: now },
      });
    }

    return createBandInvite(tx, bandId, createdBy);
  });
}
