import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { env } from "@/lib/env";
import { clerkProviderAppearance } from "@/lib/clerk-appearance";
import { ActiveBandProvider } from "@/providers/ActiveBandProvider";
import { BandWorkspaceProvider } from "@/providers/BandWorkspaceProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export function App() {
  return (
    <ClerkProvider
      publishableKey={env.clerkPublishableKey}
      appearance={clerkProviderAppearance}
      signInUrl="/login"
      signUpUrl="/signup"
      signInFallbackRedirectUrl="/onboarding"
      signUpFallbackRedirectUrl="/onboarding"
      allowedRedirectOrigins={[
        "http://localhost:5173",
        typeof window !== "undefined" ? window.location.origin : "",
      ].filter(Boolean)}
    >
      <QueryProvider>
        <SessionProvider>
          <ActiveBandProvider>
            <BandWorkspaceProvider>
              <ToastProvider>
                <ErrorBoundary>
                  <RouterProvider router={router} />
                </ErrorBoundary>
              </ToastProvider>
            </BandWorkspaceProvider>
          </ActiveBandProvider>
        </SessionProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
