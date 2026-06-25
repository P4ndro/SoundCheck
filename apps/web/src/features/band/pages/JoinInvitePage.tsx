import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useActiveBand } from "@/hooks/useActiveBand";
import { useSession } from "@/hooks/useSession";
import {
  formatInviteCodeForDisplay,
  normalizeInviteCode,
} from "@/lib/invite-code";
import { joinBandRequest } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

function inviteQuery(code: string): string {
  return `?code=${encodeURIComponent(code)}`;
}

function JoinInviteForm({ code }: { code: string }) {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { refreshSession } = useSession();
  const { setActiveBandId } = useActiveBand();
  const [inviteCode, setInviteCode] = useState(code);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const normalized = normalizeInviteCode(inviteCode);
    if (!normalized) {
      setError("Enter an invite code.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { band } = await joinBandRequest(normalized, getToken);
      await refreshSession();
      setActiveBandId(band.id);
      navigate("/songs", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not join band",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Invite code"
        htmlFor="join-invite-code"
        error={error ?? undefined}
      >
        <Input
          id="join-invite-code"
          value={inviteCode}
          onChange={(event) => {
            setInviteCode(event.target.value);
            if (error) setError(null);
          }}
          disabled={submitting}
          className="font-mono uppercase"
          autoFocus
        />
      </FormField>

      <Button
        type="button"
        className="w-full"
        size="lg"
        disabled={submitting}
        onClick={() => void handleSubmit()}
      >
        {submitting ? "Joining band…" : "Join band"}
      </Button>
    </div>
  );
}

export function JoinInvitePage() {
  const [searchParams] = useSearchParams();
  const rawCode = searchParams.get("code") ?? "";
  const code = rawCode ? normalizeInviteCode(rawCode) : "";
  const { isLoaded, isSignedIn } = useAuth();
  const { session, isLoading } = useSession();

  if (!code) {
    return (
      <AuthShell
        title="Invalid invite link"
        description="This invite link is missing a code. Ask your bandmate for a new one."
        footer={
          <Link
            to="/"
            className="text-sm font-medium text-accent-muted hover:text-accent-hover"
          >
            Back to home
          </Link>
        }
      >
        <p className="text-sm text-muted">
          Invite links look like{" "}
          <span className="font-mono text-subtle">/join?code=ABCD2345</span>
        </p>
      </AuthShell>
    );
  }

  if (!isLoaded || (isSignedIn && isLoading)) {
    return <AuthLoadingScreen />;
  }

  if (!isSignedIn) {
    const query = inviteQuery(code);

    return (
      <AuthShell
        title="You've been invited to join a band on SoundCheck"
        description="Create an account or log in to accept the invite. We won't show band details until you've joined."
        footer={
          <p className="text-xs text-subtle">
            Invite code{" "}
            <span className="font-mono text-muted">
              {formatInviteCodeForDisplay(code)}
            </span>
          </p>
        }
      >
        <div className="flex flex-col gap-3">
          <Link
            to={`/signup${query}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-accent px-5 text-base font-medium text-foreground transition-colors hover:bg-accent-hover"
          >
            Create account
          </Link>
          <Link
            to={`/login${query}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-surface-2 px-5 text-base font-medium text-foreground transition-colors hover:bg-surface-1"
          >
            Log in
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (!session) {
    return <AuthLoadingScreen />;
  }

  if (session.onboarding.nextStep === "profile") {
    return (
      <Navigate
        to={`/onboarding/profile${inviteQuery(code)}`}
        replace
      />
    );
  }

  if (session.onboarding.nextStep === "band") {
    return (
      <Navigate to={`/onboarding/band${inviteQuery(code)}`} replace />
    );
  }

  return (
    <AuthShell
      title="You've been invited to join a band on SoundCheck"
      description="Enter the invite code below to join your bandmates."
    >
      <JoinInviteForm code={code} />
    </AuthShell>
  );
}
