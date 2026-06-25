import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/hooks/useSession";
import { useActiveBand } from "@/hooks/useActiveBand";
import { cn } from "@/lib/cn";
import { normalizeInviteCode } from "@/lib/invite-code";
import {
  createBandRequest,
  joinBandRequest,
} from "@/services/api-client";
import { useToast } from "@/providers/ToastProvider";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type BandMode = "create" | "join";

export function BandOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getToken } = useAuth();
  const { refreshSession } = useSession();
  const { setActiveBandId } = useActiveBand();
  const { toast } = useToast();
  const inviteFromUrl = searchParams.get("code");
  const [mode, setMode] = useState<BandMode>(
    inviteFromUrl ? "join" : "create",
  );
  const [bandName, setBandName] = useState("");
  const [inviteCode, setInviteCode] = useState(
    inviteFromUrl ? normalizeInviteCode(inviteFromUrl) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteFromUrl) return;
    const normalized = normalizeInviteCode(inviteFromUrl);
    if (!normalized) return;
    setMode("join");
    setInviteCode(normalized);
  }, [inviteFromUrl]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!bandName.trim()) {
      setError("Enter a band name.");
      return;
    }

    setSubmitting(true);

    try {
      const { band, inviteCode: createdCode } = await createBandRequest(
        bandName.trim(),
        getToken,
      );
      await refreshSession();
      setActiveBandId(band.id);
      toast(`Band created. Share invite code ${createdCode}`, "info");
      navigate("/songs", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create band",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!inviteCode.trim()) {
      setError("Enter an invite code.");
      return;
    }

    setSubmitting(true);

    try {
      const { band } = await joinBandRequest(inviteCode.trim(), getToken);
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
    <AuthShell
      title="Join your band workspace"
      description="Create a new band or join one with an invite code. You need a band before using Soundcheck."
    >
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-1 p-1">
        <button
          type="button"
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            mode === "create"
              ? "bg-accent text-foreground"
              : "text-muted hover:text-foreground",
          )}
          onClick={() => {
            setMode("create");
            setError(null);
          }}
        >
          Create band
        </button>
        <button
          type="button"
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            mode === "join"
              ? "bg-accent text-foreground"
              : "text-muted hover:text-foreground",
          )}
          onClick={() => {
            setMode("join");
            setError(null);
          }}
        >
          Join band
        </button>
      </div>

      {mode === "create" ? (
        <form className="space-y-4" onSubmit={handleCreate}>
          <FormField label="Band name" htmlFor="band-name">
            <Input
              id="band-name"
              placeholder="The Marlowe"
              value={bandName}
              onChange={(event) => setBandName(event.target.value)}
              disabled={submitting}
            />
          </FormField>

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Creating band…" : "Create band workspace"}
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleJoin}>
          <FormField
            label="Invite code"
            htmlFor="invite-code"
            hint="Ask a bandmate for their code. Demo band: MARLOWE-DEMO"
          >
            <Input
              id="invite-code"
              placeholder="MARLOWE-DEMO"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              disabled={submitting}
              className="font-mono uppercase"
            />
          </FormField>

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Joining band…" : "Join band"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
