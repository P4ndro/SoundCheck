import { asyncHandler } from "../lib/async-handler.js";
import { getOnboardingState } from "../lib/onboarding.js";
import { prisma } from "../lib/prisma.js";
import { serializeUser } from "../lib/serializers.js";
import { ApiError } from "../middleware/error-handler.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "../schemas/profile.js";
import { Router } from "express";

export const meRouter = Router();

meRouter.use(requireAuth());

meRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const user = req.dbUser!;

    const memberships = await prisma.bandMember.findMany({
      where: { userId: user.id },
      include: { band: true },
      orderBy: { joinedAt: "asc" },
    });

    const onboarding = getOnboardingState(user, memberships.length);

    res.json({
      user: serializeUser(user),
      bands: memberships.map((membership) => ({
        id: membership.band.id,
        name: membership.band.name,
        role: membership.role,
        joinedAt: membership.joinedAt.toISOString(),
      })),
      onboarding,
    });
  }),
);

meRouter.patch(
  "/profile",
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = req.dbUser!;
    const { primaryRole, customRoleLabel } = req.body as UpdateProfileInput;

    const memberships = await prisma.bandMember.count({
      where: { userId: user.id },
    });

    if (memberships > 0) {
      throw new ApiError(409, "Profile is locked after joining a band");
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        primaryRole,
        customRoleLabel:
          primaryRole === "custom" ? customRoleLabel?.trim() : null,
        profileCompletedAt: new Date(),
      },
    });

    const onboarding = getOnboardingState(updated, 0);

    res.json({
      user: serializeUser(updated),
      onboarding,
    });
  }),
);
