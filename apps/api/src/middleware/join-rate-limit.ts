import { ApiError } from "./error-handler.js";
import type { Request } from "express";

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS_PER_WINDOW = 10;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function pruneBuckets(now: number): void {
  if (buckets.size < 500) return;

  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart >= WINDOW_MS) {
      buckets.delete(key);
    }
  }
}

export function enforceJoinRateLimit(req: Request): void {
  const userId = req.dbUser?.id ?? "anonymous";
  const key = `${userId}:${clientIp(req)}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    pruneBuckets(now);
    return;
  }

  bucket.count += 1;

  if (bucket.count > MAX_ATTEMPTS_PER_WINDOW) {
    throw new ApiError(429, "Too many attempts. Try again in a minute.");
  }
}
