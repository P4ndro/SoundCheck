import { asyncHandler } from "../../lib/async-handler.js";
import { loadWorkspacePayload } from "../../lib/serializers.js";
import { paramString } from "../../lib/request-params.js";
import { ApiError } from "../../middleware/error-handler.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireBandMember } from "../../middleware/band-member.js";
import { validate } from "../../middleware/validate.js";
import { bandIdParamsSchema } from "../../schemas/song.js";
import { bandOnboardingRouter } from "./onboarding.js";
import { chatRouter } from "./chat.js";
import { eventsRouter } from "./events.js";
import { inviteRouter } from "./invite.js";
import { membersRouter } from "./members.js";
import { setlistsRouter } from "./setlists.js";
import { songsRouter } from "./songs.js";
import { Router } from "express";

export const bandsRouter = Router();

bandsRouter.use(requireAuth());

bandsRouter.use(bandOnboardingRouter);

const bandScopedRouter = Router({ mergeParams: true });

bandScopedRouter.use(validate(bandIdParamsSchema, "params"));
bandScopedRouter.use(requireBandMember());

bandScopedRouter.get(
  "/workspace",
  asyncHandler(async (req, res) => {
    const workspace = await loadWorkspacePayload(
      paramString(req.params.bandId),
      req.dbUser!.id,
    );

    if (!workspace) {
      throw new ApiError(404, "Band not found");
    }

    res.json(workspace);
  }),
);

bandScopedRouter.use("/songs", songsRouter);
bandScopedRouter.use("/setlists", setlistsRouter);
bandScopedRouter.use("/events", eventsRouter);
bandScopedRouter.use("/chat", chatRouter);
bandScopedRouter.use("/members", membersRouter);
bandScopedRouter.use("/invite", inviteRouter);

bandsRouter.use("/:bandId", bandScopedRouter);
