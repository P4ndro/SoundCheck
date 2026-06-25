import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { useActiveBand } from "@/hooks/useActiveBand";
import { useSession } from "@/hooks/useSession";
import { joinBandRequest } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export interface JoinBandModalProps {
  open: boolean;
  onClose: () => void;
  onJoined?: (bandId: string) => void;
}

export function JoinBandModal({ open, onClose, onJoined }: JoinBandModalProps) {
  const { getToken } = useAuth();
  const { refreshSession } = useSession();
  const { setActiveBandId } = useActiveBand();
  const [inviteCode, setInviteCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setInviteCode("");
    setError(null);
    setSubmitting(false);
  }, [open]);

  const handleSubmit = async () => {
    if (!inviteCode.trim()) {
      setError("Enter an invite code.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { band } = await joinBandRequest(inviteCode.trim(), getToken);
      await refreshSession();
      setActiveBandId(band.id);
      onJoined?.(band.id);
      onClose();
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
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Join another band"
      description="Enter an invite code from a bandmate."
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? "Joining…" : "Join band"}
          </Button>
        </>
      }
    >
      <FormField
        label="Invite code"
        htmlFor="join-band-code"
        error={error ?? undefined}
        hint="You'll switch to this band after joining."
      >
        <Input
          id="join-band-code"
          placeholder="MARLOWE-DEMO"
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
    </ModalDialog>
  );
}
