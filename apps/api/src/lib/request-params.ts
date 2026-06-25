import type { Request } from "express";

export function paramString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function bandIdFromRequest(req: Request): string {
  return req.bandId ?? paramString(req.params.bandId);
}

export function songIdFromRequest(req: Request): string {
  return paramString(req.params.songId);
}

export function setlistIdFromRequest(req: Request): string {
  return paramString(req.params.setlistId);
}

export function eventIdFromRequest(req: Request): string {
  return paramString(req.params.eventId);
}

export function userIdFromRequest(req: Request): string {
  return paramString(req.params.userId);
}
