import { AuthClerkFallback } from "@/features/auth/components/AuthClerkFallback";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";
import { SignUp } from "@clerk/clerk-react";
import type { ReactNode } from "react";

interface ClerkSignUpEmbedProps {
  fallback?: ReactNode;
  forceRedirectUrl?: string;
}

export function ClerkSignUpEmbed({
  fallback = <AuthClerkFallback />,
  forceRedirectUrl = "/onboarding",
}: ClerkSignUpEmbedProps) {
  return (
    <div className="clerk-auth-embed">
      <SignUp
        routing="path"
        path="/signup"
        signInUrl="/login"
        forceRedirectUrl={forceRedirectUrl}
        appearance={clerkAuthAppearance}
        fallback={fallback}
      />
    </div>
  );
}
