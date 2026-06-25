import { AuthClerkFallback } from "@/features/auth/components/AuthClerkFallback";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";
import { SignIn } from "@clerk/clerk-react";
import type { ReactNode } from "react";

interface ClerkSignInEmbedProps {
  fallback?: ReactNode;
  forceRedirectUrl?: string;
}

export function ClerkSignInEmbed({
  fallback = <AuthClerkFallback />,
  forceRedirectUrl = "/onboarding",
}: ClerkSignInEmbedProps) {
  return (
    <div className="clerk-auth-embed">
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/signup"
        forceRedirectUrl={forceRedirectUrl}
        appearance={clerkAuthAppearance}
        fallback={fallback}
      />
    </div>
  );
}
