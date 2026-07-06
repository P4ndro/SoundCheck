import { asyncHandler } from "../../lib/async-handler.js";
import { prisma } from "../../lib/prisma.js";
import { bandIdFromRequest } from "../../lib/request-params.js";
import { serializeTab } from "../../lib/serializers.js";
import { validate } from "../../middleware/validate.js";
import { bandIdParamsSchema } from "../../schemas/song.js";
import { Router } from "express";

export const bandTabsRouter = Router({ mergeParams: true });

bandTabsRouter.get(
  "/",
  validate(bandIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);

    const tabs = await prisma.instrumentTab.findMany({
      where: { bandId },
      orderBy: [{ songId: "asc" }, { instrument: "asc" }],
    });

    res.json({ tabs: tabs.map(serializeTab) });
  }),
);
