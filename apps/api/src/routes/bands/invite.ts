import { asyncHandler } from "../../lib/async-handler.js";
import {
  getOrCreateActiveInvite,
  regenerateActiveInvite,
  serializeBandInvite,
} from "../../lib/invite-service.js";
import { bandIdFromRequest } from "../../lib/request-params.js";
import { Router } from "express";

export const inviteRouter = Router({ mergeParams: true });

inviteRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const invite = await getOrCreateActiveInvite(bandId, req.dbUser!.id);

    res.json(serializeBandInvite(invite));
  }),
);

inviteRouter.post(
  "/regenerate",
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const invite = await regenerateActiveInvite(bandId, req.dbUser!.id);

    res.json(serializeBandInvite(invite));
  }),
);
