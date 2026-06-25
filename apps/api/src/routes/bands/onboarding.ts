import { asyncHandler } from "../../lib/async-handler.js";
import { normalizeInviteCode } from "../../lib/invite-code.js";
import {
  createBandInvite,
  INVALID_INVITE_MESSAGE,
  isInviteActive,
} from "../../lib/invite-service.js";
import { prisma } from "../../lib/prisma.js";
import { serializeBand } from "../../lib/serializers.js";
import { ApiError } from "../../middleware/error-handler.js";
import { enforceJoinRateLimit } from "../../middleware/join-rate-limit.js";
import { validate } from "../../middleware/validate.js";
import {
  createBandSchema,
  joinBandSchema,
} from "../../schemas/band-onboarding.js";
import { Router } from "express";

export const bandOnboardingRouter = Router();

bandOnboardingRouter.post(
  "/",
  validate(createBandSchema),
  asyncHandler(async (req, res) => {
    const user = req.dbUser!;

    if (!user.profileCompletedAt || !user.primaryRole) {
      throw new ApiError(
        400,
        "Complete your profile before creating a band",
      );
    }

    const { name } = req.body as { name: string };
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const band = await tx.band.create({
        data: {
          id: `band-${crypto.randomUUID().slice(0, 8)}`,
          name,
          createdAt: now,
        },
      });

      await tx.bandMember.create({
        data: {
          id: `member-${crypto.randomUUID().slice(0, 8)}`,
          userId: user.id,
          bandId: band.id,
          role: user.primaryRole!,
          customRoleLabel:
            user.primaryRole === "custom" ? user.customRoleLabel : null,
          joinedAt: now,
        },
      });

      const invite = await createBandInvite(tx, band.id, user.id);

      return { band, inviteCode: invite.code };
    });

    res.status(201).json({
      band: serializeBand(result.band),
      inviteCode: result.inviteCode,
    });
  }),
);

bandOnboardingRouter.post(
  "/join",
  validate(joinBandSchema),
  asyncHandler(async (req, res) => {
    enforceJoinRateLimit(req);

    const user = req.dbUser!;

    if (!user.profileCompletedAt || !user.primaryRole) {
      throw new ApiError(400, "Complete your profile before joining a band");
    }

    const code = normalizeInviteCode((req.body as { code: string }).code);

    const invite = await prisma.bandInvite.findUnique({
      where: { code },
      include: { band: true },
    });

    if (!invite || !isInviteActive(invite)) {
      throw new ApiError(404, INVALID_INVITE_MESSAGE);
    }

    const alreadyMember = await prisma.bandMember.findUnique({
      where: {
        userId_bandId: {
          userId: user.id,
          bandId: invite.bandId,
        },
      },
    });

    if (alreadyMember) {
      throw new ApiError(409, "You are already a member of this band");
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.bandMember.create({
        data: {
          id: `member-${crypto.randomUUID().slice(0, 8)}`,
          userId: user.id,
          bandId: invite.bandId,
          role: user.primaryRole!,
          customRoleLabel:
            user.primaryRole === "custom" ? user.customRoleLabel : null,
          joinedAt: now,
        },
      });

      await tx.bandInvite.update({
        where: { id: invite.id },
        data: { useCount: { increment: 1 } },
      });
    });

    res.status(201).json({
      band: serializeBand(invite.band),
    });
  }),
);
