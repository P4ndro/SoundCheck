import { createApp } from "../app.js";
import { prisma } from "../lib/prisma.js";
import type { BandRole } from "@prisma/client";
import request from "supertest";

export const INTEGRATION_PREFIX = "inttest";

export const integrationIds = {
  memberUserId: `${INTEGRATION_PREFIX}-member`,
  outsiderUserId: `${INTEGRATION_PREFIX}-outsider`,
  bandId: `${INTEGRATION_PREFIX}-band`,
  membershipId: `${INTEGRATION_PREFIX}-membership`,
  songId: `${INTEGRATION_PREFIX}-song`,
} as const;

let dbAvailableCache: boolean | null = null;

export async function integrationDbAvailable(): Promise<boolean> {
  if (dbAvailableCache !== null) {
    return dbAvailableCache;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbAvailableCache = true;
  } catch {
    dbAvailableCache = false;
  }

  return dbAvailableCache;
}

export function createIntegrationAgent(userId?: string) {
  const app = createApp({ skipClerk: true });
  const agent = request(app);

  if (!userId) {
    return agent;
  }

  return {
    get: (url: string) => agent.get(url).set("x-test-user-id", userId),
    post: (url: string) => agent.post(url).set("x-test-user-id", userId),
    patch: (url: string) => agent.patch(url).set("x-test-user-id", userId),
    delete: (url: string) => agent.delete(url).set("x-test-user-id", userId),
  };
}

export async function seedIntegrationFixtures(): Promise<void> {
  const now = new Date();

  await prisma.user.createMany({
    data: [
      {
        id: integrationIds.memberUserId,
        email: `${integrationIds.memberUserId}@test.local`,
        name: "Integration Member",
        profileCompletedAt: now,
      },
      {
        id: integrationIds.outsiderUserId,
        email: `${integrationIds.outsiderUserId}@test.local`,
        name: "Integration Outsider",
        profileCompletedAt: now,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.band.createMany({
    data: [
      {
        id: integrationIds.bandId,
        name: "Integration Test Band",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.bandMember.createMany({
    data: [
      {
        id: integrationIds.membershipId,
        userId: integrationIds.memberUserId,
        bandId: integrationIds.bandId,
        role: "bass" satisfies BandRole,
        joinedAt: now,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.song.createMany({
    data: [
      {
        id: integrationIds.songId,
        bandId: integrationIds.bandId,
        title: "Fixture Song",
        bpm: 120,
        durationSeconds: 180,
        status: "in_progress",
        createdAt: now,
        updatedAt: now,
      },
    ],
    skipDuplicates: true,
  });
}

export async function cleanupIntegrationFixtures(): Promise<void> {
  await prisma.instrumentTab.deleteMany({
    where: { bandId: integrationIds.bandId },
  });
  await prisma.setlistItem.deleteMany({
    where: { setlist: { bandId: integrationIds.bandId } },
  });
  await prisma.setlist.deleteMany({
    where: { bandId: integrationIds.bandId },
  });
  await prisma.chatMessage.deleteMany({
    where: { bandId: integrationIds.bandId },
  });
  await prisma.bandEvent.deleteMany({
    where: { bandId: integrationIds.bandId },
  });
  await prisma.song.deleteMany({
    where: { bandId: integrationIds.bandId },
  });
  await prisma.bandInvite.deleteMany({
    where: { bandId: integrationIds.bandId },
  });
  await prisma.bandMember.deleteMany({
    where: { bandId: integrationIds.bandId },
  });
  await prisma.band.deleteMany({
    where: { id: integrationIds.bandId },
  });
  await prisma.user.deleteMany({
    where: {
      id: {
        in: [integrationIds.memberUserId, integrationIds.outsiderUserId],
      },
    },
  });
}
