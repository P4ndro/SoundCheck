import { syncClerkUserFromWebhook } from "../../lib/clerk-webhook-sync.js";
import { clerkWebhookEventSchema } from "../../lib/clerk-webhook-sanitize.js";
import { isWebhookRateLimited } from "../../middleware/webhook-rate-limit.js";
import { getClerkWebhookSecret } from "../../config/env.js";
import { asyncHandler } from "../../lib/async-handler.js";
import type { Request, Response } from "express";
import { Webhook } from "svix";

const REPLAY_TOLERANCE_SECONDS = 300;

function getSvixHeader(req: Request, name: string): string | undefined {
  const value = req.headers[name];
  return typeof value === "string" ? value : undefined;
}

function logWebhook(eventType: string, clerkId: string | null, detail?: string): void {
  console.info("[clerk-webhook]", {
    eventType,
    clerkId: clerkId ?? "unknown",
    ...(detail ? { detail } : {}),
  });
}

function verifyTimestamp(svixTimestamp: string | undefined): boolean {
  if (!svixTimestamp) return false;
  const timestamp = Number(svixTimestamp);
  if (!Number.isFinite(timestamp)) return false;
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - timestamp) <= REPLAY_TOLERANCE_SECONDS;
}

export const handleClerkWebhook = asyncHandler(async (req: Request, res: Response) => {
  if (isWebhookRateLimited(req)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  const secret = getClerkWebhookSecret();
  if (!secret) {
    res.status(503).json({ error: "Webhook not configured" });
    return;
  }

  const svixId = getSvixHeader(req, "svix-id");
  const svixTimestamp = getSvixHeader(req, "svix-timestamp");
  const svixSignature = getSvixHeader(req, "svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    res.status(400).json({ error: "Missing svix headers" });
    return;
  }

  if (!verifyTimestamp(svixTimestamp)) {
    res.status(400).json({ error: "Stale webhook timestamp" });
    return;
  }

  const rawBody =
    req.body instanceof Buffer
      ? req.body.toString("utf8")
      : typeof req.body === "string"
        ? req.body
        : "";

  if (!rawBody) {
    res.status(400).json({ error: "Empty body" });
    return;
  }

  let payload: unknown;
  try {
    const webhook = new Webhook(secret);
    payload = webhook.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const parsed = clerkWebhookEventSchema.safeParse(payload);
  if (!parsed.success) {
    logWebhook("invalid_payload", null, "schema_validation_failed");
    res.status(200).json({ ok: true });
    return;
  }

  const { type: eventType, data } = parsed.data;
  const clerkId = typeof data.id === "string" ? data.id : null;
  logWebhook(eventType, clerkId);

  try {
    await syncClerkUserFromWebhook(parsed.data);
  } catch (error) {
    console.error("[clerk-webhook] sync failed", {
      eventType,
      clerkId,
      error: error instanceof Error ? error.message : "unknown",
    });
  }

  res.status(200).json({ ok: true });
});
