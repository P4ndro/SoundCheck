import { env } from "@/lib/env";
import { clerkProviderAppearance } from "@/lib/clerk-appearance";
import { BandWorkspaceProvider } from "@/providers/BandWorkspaceProvider";
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
      <SessionProvider>
        <BandWorkspaceProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </BandWorkspaceProvider>
      </SessionProvider>
    </ClerkProvider>
  );
}
