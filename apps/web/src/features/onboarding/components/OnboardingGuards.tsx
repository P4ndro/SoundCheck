import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useSession } from "@/hooks/useSession";
import type { OnboardingStep } from "@/types";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

function redirectForStep(step: OnboardingStep): string {
  switch (step) {
    case "profile":
      return "/onboarding/profile";
    case "band":
      return "/onboarding/band";
    case "complete":
      return "/songs";
  }
}

export function OnboardingRedirectPage() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate to={redirectForStep(session.onboarding.nextStep)} replace />
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

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.onboarding.nextStep !== "complete") {
    return (
      <Navigate
        to={redirectForStep(session.onboarding.nextStep)}
        replace
      />
    );
  }

  return children;
}
