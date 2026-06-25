import { asyncHandler } from "../../lib/async-handler.js";
import { prisma } from "../../lib/prisma.js";
import {
  bandIdFromRequest,
  setlistIdFromRequest,
  songIdFromRequest,
} from "../../lib/request-params.js";
import {
  addSetlistItem,
  getSetlistInBandOrThrow,
  removeSetlistItem,
  reorderSetlistItems,
  serializeSetlistRecord,
} from "../../lib/setlist-service.js";
import { validate } from "../../middleware/validate.js";
import {
  addSetlistItemSchema,
  createSetlistSchema,
  reorderSetlistItemsSchema,
  setlistIdParamsSchema,
  setlistItemParamsSchema,
  updateSetlistSchema,
} from "../../schemas/setlist.js";
import type {
  AddSetlistItemInput,
  CreateSetlistInput,
  ReorderSetlistItemsInput,
  UpdateSetlistInput,
} from "../../schemas/setlist.js";
import { Router } from "express";

export const setlistsRouter = Router({ mergeParams: true });

setlistsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const setlists = await prisma.setlist.findMany({
      where: { bandId },
      include: {
        items: { orderBy: { position: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({
      setlists: setlists.map((setlist) => serializeSetlistRecord(setlist)),
    });
  }),
);

setlistsRouter.get(
  "/:setlistId",
  validate(setlistIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const setlist = await getSetlistInBandOrThrow(
      setlistIdFromRequest(req),
      bandIdFromRequest(req),
    );

    res.json({ setlist: serializeSetlistRecord(setlist) });
  }),
);

setlistsRouter.post(
  "/",
  validate(createSetlistSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as CreateSetlistInput;
    const now = new Date();

    const setlist = await prisma.setlist.create({
      data: {
        id: `setlist-${crypto.randomUUID().slice(0, 8)}`,
        bandId: bandIdFromRequest(req),
        name: body.name,
        description: body.description,
        createdAt: now,
        updatedAt: now,
      },
      include: { items: true },
    });

    res.status(201).json({ setlist: serializeSetlistRecord(setlist) });
  }),
);

setlistsRouter.patch(
  "/:setlistId",
  validate(setlistIdParamsSchema, "params"),
  validate(updateSetlistSchema),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const setlistId = setlistIdFromRequest(req);
    const body = req.body as UpdateSetlistInput;

    const existing = await getSetlistInBandOrThrow(setlistId, bandId);

    const setlist = await prisma.setlist.update({
      where: { id: existing.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        items: { orderBy: { position: "asc" } },
      },
    });

    res.json({ setlist: serializeSetlistRecord(setlist) });
  }),
);

setlistsRouter.delete(
  "/:setlistId",
  validate(setlistIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const setlistId = setlistIdFromRequest(req);

    const existing = await getSetlistInBandOrThrow(setlistId, bandId);

    await prisma.setlist.delete({ where: { id: existing.id } });
    res.status(204).send();
  }),
);

setlistsRouter.post(
  "/:setlistId/duplicate",
  validate(setlistIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const setlistId = setlistIdFromRequest(req);
    const source = await getSetlistInBandOrThrow(setlistId, bandId);
    const now = new Date();

    const copyName = `${source.name} (copy)`.slice(0, 200);

    const setlist = await prisma.setlist.create({
      data: {
        id: `setlist-${crypto.randomUUID().slice(0, 8)}`,
        bandId,
        name: copyName,
        description: source.description,
        createdAt: now,
        updatedAt: now,
        items: {
          create: source.items.map((item, index) => ({
            id: `setlist-item-${crypto.randomUUID().slice(0, 8)}`,
            songId: item.songId,
            position: index,
          })),
        },
      },
      include: {
        items: { orderBy: { position: "asc" } },
      },
    });

    res.status(201).json({ setlist: serializeSetlistRecord(setlist) });
  }),
);

setlistsRouter.post(
  "/:setlistId/items",
  validate(setlistIdParamsSchema, "params"),
  validate(addSetlistItemSchema),
  asyncHandler(async (req, res) => {
    const { songId } = req.body as AddSetlistItemInput;
    const setlist = await addSetlistItem(
      setlistIdFromRequest(req),
      bandIdFromRequest(req),
      songId,
    );

    res.status(201).json({ setlist });
  }),
);

setlistsRouter.delete(
  "/:setlistId/items/:songId",
  validate(setlistItemParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const setlist = await removeSetlistItem(
      setlistIdFromRequest(req),
      bandIdFromRequest(req),
      songIdFromRequest(req),
    );

    res.json({ setlist });
  }),
);

setlistsRouter.put(
  "/:setlistId/items/order",
  validate(setlistIdParamsSchema, "params"),
  validate(reorderSetlistItemsSchema),
  asyncHandler(async (req, res) => {
    const { songIds } = req.body as ReorderSetlistItemsInput;
    const setlist = await reorderSetlistItems(
      setlistIdFromRequest(req),
      bandIdFromRequest(req),
      songIds,
    );

    res.json({ setlist });
  }),
);
