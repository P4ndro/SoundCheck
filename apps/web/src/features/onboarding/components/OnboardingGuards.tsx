import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useSession } from "@/hooks/useSession";
import type { OnboardingStep } from "@/types";
import type { ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { normalizeInviteCode } from "@/lib/invite-code";

function inviteQuery(code: string | null): string {
  if (!code) return "";
  const normalized = normalizeInviteCode(code);
  return normalized ? `?code=${encodeURIComponent(normalized)}` : "";
}

function redirectForStep(step: OnboardingStep, code: string | null): string {
  const query = inviteQuery(code);

  switch (step) {
    case "profile":
      return `/onboarding/profile${query}`;
    case "band":
      return `/onboarding/band${query}`;
    case "complete":
      return code ? `/join${inviteQuery(code)}` : "/songs";
  }
}

export function OnboardingRedirectPage() {
  const { session, isLoading } = useSession();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={redirectForStep(session.onboarding.nextStep, code)}
      replace
    />
  );
}

export function ProfileOnboardingGuard({ children }: { children: ReactNode }) {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const { nextStep } = session.onboarding;

  if (nextStep === "complete") {
    return <Navigate to="/songs" replace />;
  }

  if (nextStep === "band") {
    return <Navigate to="/onboarding/band" replace />;
  }

  return children;
}

export function BandOnboardingGuard({ children }: { children: ReactNode }) {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const { nextStep } = session.onboarding;

  if (nextStep === "complete") {
    return <Navigate to="/songs" replace />;
  }

  if (nextStep === "profile") {
    return <Navigate to="/onboarding/profile" replace />;
  }

  return children;
}

export function AppGate({ children }: { children: ReactNode }) {
  const { session, isLoading } = useSession();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.onboarding.nextStep !== "complete") {
    return (
      <Navigate
        to={redirectForStep(session.onboarding.nextStep, code)}
        replace
      />
    );
  }

  return children;
}
