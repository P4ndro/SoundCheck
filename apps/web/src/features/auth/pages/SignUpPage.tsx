import { AuthShell } from "@/features/auth/components/AuthShell";
import { ClerkSignUpEmbed } from "@/features/auth/components/ClerkSignUpEmbed";
import { normalizeInviteCode } from "@/lib/invite-code";
import { Link, useSearchParams } from "react-router-dom";

export function SignUpPage() {
  const [searchParams] = useSearchParams();
  const rawCode = searchParams.get("code");
  const code = rawCode ? normalizeInviteCode(rawCode) : "";
  const loginHref = code ? `/login?code=${encodeURIComponent(code)}` : "/login";
  const redirectUrl = code
    ? `/onboarding?code=${encodeURIComponent(code)}`
    : "/onboarding";

  return (
    <AuthShell
      variant="clerk"
      title="Create account"
      description={
        code
          ? "Sign up to accept your band invite."
          : "Sign up with email or Google, then set up your band."
      }
      footer={
        <div className="space-y-3">
          <p className="text-muted">
            Already have an account?{" "}
            <Link
              to={loginHref}
              className="font-medium text-accent-muted hover:text-accent-hover"
            >
              Log in
            </Link>
          </p>
          {!code && (
            <p className="text-xs leading-relaxed text-subtle">
              After signup you will set your instrument and create or join a band.
              Use invite code{" "}
              <span className="font-mono text-accent-muted">MARLOWE-DEMO</span> for
              the demo band.
            </p>
          )}
        </div>
      }
    >
      <ClerkSignUpEmbed forceRedirectUrl={redirectUrl} />
    </AuthShell>
  );
}
