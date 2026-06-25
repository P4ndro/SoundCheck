import { asyncHandler } from "../../lib/async-handler.js";
import { loadMemberProfile } from "../../lib/member-service.js";
import {
  bandIdFromRequest,
  userIdFromRequest,
} from "../../lib/request-params.js";
import { validate } from "../../middleware/validate.js";
import { memberUserIdParamsSchema } from "../../schemas/member.js";
import { Router } from "express";

export const membersRouter = Router({ mergeParams: true });

membersRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const profile = await loadMemberProfile(
      bandIdFromRequest(req),
      req.dbUser!.id,
      req.dbUser!.id,
    );

    res.json(profile);
  }),
);

membersRouter.get(
  "/:userId",
  validate(memberUserIdParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const profile = await loadMemberProfile(
      bandIdFromRequest(req),
      userIdFromRequest(req),
      req.dbUser!.id,
    );

    res.json(profile);
  }),
);
