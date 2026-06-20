import { AuthShell } from "@/features/auth/components/AuthShell";
import { ClerkSignUpEmbed } from "@/features/auth/components/ClerkSignUpEmbed";
import { Link } from "react-router-dom";

export function SignUpPage() {
  return (
    <AuthShell
      variant="clerk"
      title="Create account"
      description="Sign up with email or Google, then set up your band."
      footer={
        <div className="space-y-3">
          <p className="text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-accent-muted hover:text-accent-hover"
            >
              Log in
            </Link>
          </p>
          <p className="text-xs leading-relaxed text-subtle">
            After signup you will set your instrument and create or join a band.
            Use invite code{" "}
            <span className="font-mono text-accent-muted">MARLOWE-DEMO</span> for
            the demo band.
          </p>
        </div>
      }
    >
      <ClerkSignUpEmbed />
    </AuthShell>
  );
}
