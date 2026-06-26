import { asyncHandler } from "../../lib/async-handler.js";
import {
  assertCanEditTabInstrument,
  instrumentForMemberRole,
} from "../../lib/tab-permissions.js";
import { prisma } from "../../lib/prisma.js";
import {
  bandIdFromRequest,
  paramString,
  songIdFromRequest,
} from "../../lib/request-params.js";
import { serializeTab } from "../../lib/serializers.js";
import { ApiError } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import {
  createTabSchema,
  tabIdParamsSchema,
  updateTabSchema,
} from "../../schemas/tab.js";
import { songIdParamsSchema } from "../../schemas/song.js";
import type { CreateTabInput, UpdateTabInput } from "../../schemas/tab.js";
import { Router } from "express";

export const songTabsRouter = Router({ mergeParams: true });

songTabsRouter.get(
  "/",
  validate(songIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const songId = songIdFromRequest(req);

    const song = await prisma.song.findFirst({
      where: { id: songId, bandId },
      select: { id: true },
    });

    if (!song) {
      throw new ApiError(404, "Song not found");
    }

    const tabs = await prisma.instrumentTab.findMany({
      where: { bandId, songId },
      orderBy: { instrument: "asc" },
    });

    res.json({ tabs: tabs.map(serializeTab) });
  }),
);

songTabsRouter.post(
  "/",
  validate(songIdParamsSchema, "params"),
  validate(createTabSchema),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const songId = songIdFromRequest(req);
    const membership = req.bandMembership!;
    const body = req.body as CreateTabInput;

    const instrument = instrumentForMemberRole(membership.role);

    const song = await prisma.song.findFirst({
      where: { id: songId, bandId },
      select: { id: true },
    });

    if (!song) {
      throw new ApiError(404, "Song not found");
    }

    const existing = await prisma.instrumentTab.findFirst({
      where: {
        songId,
        instrument,
      },
    });

    if (existing) {
      throw new ApiError(
        409,
        "A notation part already exists for this song and instrument",
      );
    }

    const tab = await prisma.instrumentTab.create({
      data: {
        id: `tab-${crypto.randomUUID().slice(0, 8)}`,
        songId,
        bandId,
        instrument,
        asciiTab: body.asciiTab,
        chordChart: body.chordChart,
        capo: body.capo ?? null,
        trackName: body.trackName ?? null,
      },
    });

    res.status(201).json({ tab: serializeTab(tab) });
  }),
);

songTabsRouter.patch(
  "/:tabId",
  validate(tabIdParamsSchema, "params"),
  validate(updateTabSchema),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const songId = songIdFromRequest(req);
    const tabId = paramString(req.params.tabId);
    const membership = req.bandMembership!;
    const body = req.body as UpdateTabInput;

    const tab = await prisma.instrumentTab.findFirst({
      where: { id: tabId, bandId, songId },
    });

    if (!tab) {
      throw new ApiError(404, "Notation not found");
    }

    assertCanEditTabInstrument(membership.role, tab.instrument);

    const updated = await prisma.instrumentTab.update({
      where: { id: tab.id },
      data: {
        ...(body.asciiTab !== undefined ? { asciiTab: body.asciiTab } : {}),
        ...(body.chordChart !== undefined
          ? { chordChart: body.chordChart }
          : {}),
        ...(body.capo !== undefined ? { capo: body.capo } : {}),
        ...(body.trackName !== undefined ? { trackName: body.trackName } : {}),
      },
    });

    res.json({ tab: serializeTab(updated) });
  }),
);
