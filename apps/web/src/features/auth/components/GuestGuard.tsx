import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useAuth } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export function GuestGuard({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  if (isSignedIn) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
