import { describe, expect, it, beforeAll, afterAll } from "vitest";
import {
  cleanupIntegrationFixtures,
  createIntegrationAgent,
  integrationDbAvailable,
  integrationIds,
  seedIntegrationFixtures,
} from "./test/integration-helpers.js";

describe("API integration: health", () => {
  let dbReady = false;

  beforeAll(async () => {
    dbReady = await integrationDbAvailable();
    if (!dbReady) return;
    await cleanupIntegrationFixtures();
    await seedIntegrationFixtures();
  });

  afterAll(async () => {
    if (dbReady) {
      await cleanupIntegrationFixtures();
    }
  });

  it("returns ok", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent().get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("soundcheck-api");
  });
});

describe("API integration: auth", () => {
  let dbReady = false;

  beforeAll(async () => {
    dbReady = await integrationDbAvailable();
    if (!dbReady) return;
    await cleanupIntegrationFixtures();
    await seedIntegrationFixtures();
  });

  afterAll(async () => {
    if (dbReady) {
      await cleanupIntegrationFixtures();
    }
  });

  it("returns 401 for protected routes without auth", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent().get("/api/me");

    expect(response.status).toBe(401);
  });

  it("returns 403 when user is not a band member", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.outsiderUserId).get(
      `/api/bands/${integrationIds.bandId}/songs`,
    );

    expect(response.status).toBe(403);
  });

  it("returns member data for authenticated user", async ({ skip }) => {
    if (!dbReady) skip();

    const response = await createIntegrationAgent(integrationIds.memberUserId).get(
      "/api/me",
    );

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe(integrationIds.memberUserId);
    expect(response.body.bands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: integrationIds.bandId }),
      ]),
    );
  });
});
