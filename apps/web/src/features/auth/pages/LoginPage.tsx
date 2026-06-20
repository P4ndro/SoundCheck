import { AuthShell } from "@/features/auth/components/AuthShell";
import { ClerkSignInEmbed } from "@/features/auth/components/ClerkSignInEmbed";
import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <AuthShell
      variant="clerk"
      title="Log in"
      description="Access your band workspace with email or Google."
      footer={
        <div className="space-y-3">
          <p className="text-muted">
            New here?{" "}
            <Link
              to="/signup"
              className="font-medium text-accent-muted hover:text-accent-hover"
            >
              Create an account
            </Link>
          </p>
          <p className="text-xs text-subtle">
            Demo tip: sign in with{" "}
            <span className="font-mono text-accent-muted">alex@example.com</span>{" "}
            to skip onboarding via the seeded band.
          </p>
        </div>
      }
    >
      <ClerkSignInEmbed />
    </AuthShell>
  );
}
