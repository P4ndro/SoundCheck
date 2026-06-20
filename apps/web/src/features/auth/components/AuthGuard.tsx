import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useAuth } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
