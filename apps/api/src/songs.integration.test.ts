import { prisma } from "./lib/prisma.js";
import {
  cleanupIntegrationFixtures,
  createIntegrationAgent,
  integrationDbAvailable,
  integrationIds,
  seedIntegrationFixtures,
} from "./test/integration-helpers.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("API integration: songs", () => {
  let dbReady = false;
  let createdSongId: string | null = null;

  beforeAll(async () => {
    dbReady = await integrationDbAvailable();
    if (!dbReady) return;
    await cleanupIntegrationFixtures();
    await seedIntegrationFixtures();
  });

  afterAll(async () => {
    if (!dbReady) return;

    if (createdSongId) {
      await prisma.song.deleteMany({ where: { id: createdSongId } });
    }

    await cleanupIntegrationFixtures();
  });

  it("lists songs for band members", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.memberUserId).get(
      `/api/bands/${integrationIds.bandId}/songs`,
    );

    expect(response.status).toBe(200);
    expect(response.body.songs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: integrationIds.songId, title: "Fixture Song" }),
      ]),
    );
  });

  it("creates a song", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.memberUserId)
      .post(`/api/bands/${integrationIds.bandId}/songs`)
      .send({
        title: "Integration New Song",
        bpm: 100,
        durationSeconds: 200,
      });

    expect(response.status).toBe(201);
    expect(response.body.song.title).toBe("Integration New Song");
    createdSongId = response.body.song.id;
  });

  it("updates a song", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.memberUserId)
      .patch(`/api/bands/${integrationIds.bandId}/songs/${integrationIds.songId}`)
      .send({ title: "Updated Fixture Song" });

    expect(response.status).toBe(200);
    expect(response.body.song.title).toBe("Updated Fixture Song");
  });

  it("deletes a song", async ({ skip }) => {
    if (!dbReady) skip();

    const now = new Date();
    const song = await prisma.song.create({
      data: {
        id: `${integrationIds.songId}-delete`,
        bandId: integrationIds.bandId,
        title: "Delete Me",
        bpm: 90,
        durationSeconds: 120,
        status: "not_started",
        createdAt: now,
        updatedAt: now,
      },
    });

    const response = await createIntegrationAgent(integrationIds.memberUserId).delete(
      `/api/bands/${integrationIds.bandId}/songs/${song.id}`,
    );

    expect(response.status).toBe(204);

    const deleted = await prisma.song.findUnique({ where: { id: song.id } });
    expect(deleted).toBeNull();
  });

  it("returns 404 for missing song", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.memberUserId).get(
      `/api/bands/${integrationIds.bandId}/songs/missing-song`,
    );

    expect(response.status).toBe(404);
  });
});
