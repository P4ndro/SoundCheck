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
    >
      <QueryProvider>
        <SessionProvider>
          <ActiveBandProvider>
            <BandWorkspaceProvider>
              <ToastProvider>
                <RouterProvider router={router} />
              </ToastProvider>
            </BandWorkspaceProvider>
          </ActiveBandProvider>
        </SessionProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
