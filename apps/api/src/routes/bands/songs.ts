import { asyncHandler } from "../../lib/async-handler.js";
import { prisma } from "../../lib/prisma.js";
import {
  bandIdFromRequest,
  songIdFromRequest,
} from "../../lib/request-params.js";
import { serializeSong } from "../../lib/serializers.js";
import { ApiError } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import {
  createSongSchema,
  songIdParamsSchema,
  updateSongSchema,
} from "../../schemas/song.js";
import type { CreateSongInput, UpdateSongInput } from "../../schemas/song.js";
import { songTabsRouter } from "./song-tabs.js";
import { Router } from "express";

export const songsRouter = Router({ mergeParams: true });

songsRouter.use("/:songId/tabs", songTabsRouter);

songsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const songs = await prisma.song.findMany({
      where: { bandId },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ songs: songs.map(serializeSong) });
  }),
);

songsRouter.get(
  "/:songId",
  validate(songIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const song = await prisma.song.findFirst({
      where: {
        id: songIdFromRequest(req),
        bandId: bandIdFromRequest(req),
      },
    });

    if (!song) {
      throw new ApiError(404, "Song not found");
    }

    res.json({ song: serializeSong(song) });
  }),
);

songsRouter.post(
  "/",
  validate(createSongSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as CreateSongInput;
    const now = new Date();
    const song = await prisma.song.create({
      data: {
        id: `song-${crypto.randomUUID().slice(0, 8)}`,
        bandId: bandIdFromRequest(req),
        ...body,
        createdAt: now,
        updatedAt: now,
      },
    });

    res.status(201).json({ song: serializeSong(song) });
  }),
);

songsRouter.patch(
  "/:songId",
  validate(songIdParamsSchema, "params"),
  validate(updateSongSchema),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const songId = songIdFromRequest(req);
    const body = req.body as UpdateSongInput;

    const existing = await prisma.song.findFirst({
      where: { id: songId, bandId },
    });

    if (!existing) {
      throw new ApiError(404, "Song not found");
    }

    const song = await prisma.song.update({
      where: { id: existing.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    res.json({ song: serializeSong(song) });
  }),
);

songsRouter.delete(
  "/:songId",
  validate(songIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const existing = await prisma.song.findFirst({
      where: {
        id: songIdFromRequest(req),
        bandId: bandIdFromRequest(req),
      },
    });

    if (!existing) {
      throw new ApiError(404, "Song not found");
    }

    await prisma.song.delete({ where: { id: existing.id } });
    res.status(204).send();
  }),
);
