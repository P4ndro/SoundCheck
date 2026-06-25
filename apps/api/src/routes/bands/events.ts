import { asyncHandler } from "../../lib/async-handler.js";
import { prisma } from "../../lib/prisma.js";
import {
  assertSetlistInBand,
  getEventInBandOrThrow,
  serializeEventRecord,
} from "../../lib/event-service.js";
import {
  bandIdFromRequest,
  eventIdFromRequest,
} from "../../lib/request-params.js";
import { ApiError } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import {
  createEventSchema,
  eventIdParamsSchema,
  updateEventSchema,
} from "../../schemas/event.js";
import type { CreateEventInput, UpdateEventInput } from "../../schemas/event.js";
import { Router } from "express";

export const eventsRouter = Router({ mergeParams: true });

eventsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const events = await prisma.bandEvent.findMany({
      where: { bandId },
      orderBy: { start: "asc" },
    });

    res.json({ events: events.map(serializeEventRecord) });
  }),
);

eventsRouter.get(
  "/:eventId",
  validate(eventIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const event = await getEventInBandOrThrow(
      eventIdFromRequest(req),
      bandIdFromRequest(req),
    );

    res.json({ event: serializeEventRecord(event) });
  }),
);

eventsRouter.post(
  "/",
  validate(createEventSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as CreateEventInput;
    const bandId = bandIdFromRequest(req);

    if (body.setlistId) {
      await assertSetlistInBand(bandId, body.setlistId);
    }

    const event = await prisma.bandEvent.create({
      data: {
        id: `event-${crypto.randomUUID().slice(0, 8)}`,
        bandId,
        title: body.title,
        type: body.type,
        start: new Date(body.start),
        end: new Date(body.end),
        location: body.location,
        notes: body.notes,
        setlistId: body.setlistId ?? null,
      },
    });

    res.status(201).json({ event: serializeEventRecord(event) });
  }),
);

eventsRouter.patch(
  "/:eventId",
  validate(eventIdParamsSchema, "params"),
  validate(updateEventSchema),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const eventId = eventIdFromRequest(req);
    const body = req.body as UpdateEventInput;

    const existing = await getEventInBandOrThrow(eventId, bandId);

    if (body.setlistId) {
      await assertSetlistInBand(bandId, body.setlistId);
    }

    const start = body.start ? new Date(body.start) : existing.start;
    const end = body.end ? new Date(body.end) : existing.end;

    if (end <= start) {
      throw new ApiError(400, "End must be after start");
    }

    const event = await prisma.bandEvent.update({
      where: { id: existing.id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.type !== undefined ? { type: body.type } : {}),
        ...(body.start !== undefined ? { start } : {}),
        ...(body.end !== undefined ? { end } : {}),
        ...(body.location !== undefined ? { location: body.location } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.setlistId !== undefined
          ? { setlistId: body.setlistId ?? null }
          : {}),
      },
    });

    res.json({ event: serializeEventRecord(event) });
  }),
);

eventsRouter.delete(
  "/:eventId",
  validate(eventIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const eventId = eventIdFromRequest(req);

    const existing = await getEventInBandOrThrow(eventId, bandId);

    await prisma.bandEvent.delete({ where: { id: existing.id } });
    res.status(204).send();
  }),
);
