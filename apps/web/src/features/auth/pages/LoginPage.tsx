import { AuthShell } from "@/features/auth/components/AuthShell";
import { ClerkSignInEmbed } from "@/features/auth/components/ClerkSignInEmbed";
import { normalizeInviteCode } from "@/lib/invite-code";
import { Link, useSearchParams } from "react-router-dom";

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const rawCode = searchParams.get("code");
  const code = rawCode ? normalizeInviteCode(rawCode) : "";
  const signupHref = code ? `/signup?code=${encodeURIComponent(code)}` : "/signup";
  const redirectUrl = code
    ? `/join?code=${encodeURIComponent(code)}`
    : "/onboarding";

  return (
    <AuthShell
      variant="clerk"
      title="Log in"
      description={
        code
          ? "Log in to accept your band invite."
          : "Access your band workspace with email or Google."
      }
      footer={
        <div className="space-y-3">
          <p className="text-muted">
            New here?{" "}
            <Link
              to={signupHref}
              className="font-medium text-accent-muted hover:text-accent-hover"
            >
              Create an account
            </Link>
          </p>
          {!code && (
            <p className="text-xs text-subtle">
              Demo tip: sign in with{" "}
              <span className="font-mono text-accent-muted">alex@example.com</span>{" "}
              to skip onboarding via the seeded band.
            </p>
          )}
        </div>
      }
    >
      <ClerkSignInEmbed forceRedirectUrl={redirectUrl} />
    </AuthShell>
  );
}
