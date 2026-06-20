import type { User } from "@prisma/client";

export type OnboardingStep = "profile" | "band" | "complete";

export interface OnboardingState {
  profileComplete: boolean;
  hasBand: boolean;
  nextStep: OnboardingStep;
}

export function getOnboardingState(
  user: Pick<User, "profileCompletedAt">,
  bandCount: number,
): OnboardingState {
  const hasBand = bandCount > 0;

  if (hasBand) {
    return {
      profileComplete: true,
      hasBand: true,
      nextStep: "complete",
    };
  }

  const profileComplete = user.profileCompletedAt != null;

  return {
    profileComplete,
    hasBand: false,
    nextStep: profileComplete ? "band" : "profile",
  };
}

export function assertProfileComplete(
  user: Pick<User, "profileCompletedAt" | "primaryRole">,
): void {
  if (!user.profileCompletedAt || !user.primaryRole) {
    throw new Error("Complete your profile before continuing");
  }
}
