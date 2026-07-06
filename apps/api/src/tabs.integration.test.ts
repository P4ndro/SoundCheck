import { prisma } from "./lib/prisma.js";
import {
  cleanupIntegrationFixtures,
  createIntegrationAgent,
  integrationDbAvailable,
  integrationIds,
  seedIntegrationFixtures,
} from "./test/integration-helpers.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("API integration: tabs", () => {
  let dbReady = false;

  beforeAll(async () => {
    dbReady = await integrationDbAvailable();
    if (!dbReady) return;
    await cleanupIntegrationFixtures();
    await seedIntegrationFixtures();
  });

  afterAll(async () => {
    if (!dbReady) return;

    await prisma.instrumentTab.deleteMany({
      where: { songId: integrationIds.songId },
    });
    await cleanupIntegrationFixtures();
  });

  it("creates a tab for the member instrument", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.memberUserId)
      .post(`/api/bands/${integrationIds.bandId}/songs/${integrationIds.songId}/tabs`)
      .send({
        asciiTab: "G|---|",
        chordChart: "Am F C G",
      });

    expect(response.status).toBe(201);
    expect(response.body.tab.instrument).toBe("bass");
    expect(response.body.tab.asciiTab).toBe("G|---|");
  });

  it("returns 409 when tab already exists for instrument", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.memberUserId)
      .post(`/api/bands/${integrationIds.bandId}/songs/${integrationIds.songId}/tabs`)
      .send({
        asciiTab: "duplicate",
      });

    expect(response.status).toBe(409);
  });

  it("updates an existing tab", async ({ skip }) => {
    if (!dbReady) skip();

    const tab = await prisma.instrumentTab.findFirst({
      where: {
        songId: integrationIds.songId,
        instrument: "bass",
      },
    });

    expect(tab).not.toBeNull();

    const response = await createIntegrationAgent(integrationIds.memberUserId)
      .patch(
        `/api/bands/${integrationIds.bandId}/songs/${integrationIds.songId}/tabs/${tab!.id}`,
      )
      .send({
        asciiTab: "G|-----|",
      });

    expect(response.status).toBe(200);
    expect(response.body.tab.asciiTab).toBe("G|-----|");
  });

  it("lists all band tabs", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.memberUserId).get(
      `/api/bands/${integrationIds.bandId}/tabs`,
    );

    expect(response.status).toBe(200);
    expect(response.body.tabs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          songId: integrationIds.songId,
          instrument: "bass",
        }),
      ]),
    );
  });
});
