import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { useActiveBand } from "@/hooks/useActiveBand";
import { useSession } from "@/hooks/useSession";
import { createBandRequest } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export interface CreateBandModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (bandId: string, inviteCode: string) => void;
}

export function CreateBandModal({
  open,
  onClose,
  onCreated,
}: CreateBandModalProps) {
  const { getToken } = useAuth();
  const { refreshSession } = useSession();
  const { setActiveBandId } = useActiveBand();
  const [bandName, setBandName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setBandName("");
    setError(null);
    setSubmitting(false);
  }, [open]);

  const handleSubmit = async () => {
    if (!bandName.trim()) {
      setError("Enter a band name.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { band, inviteCode } = await createBandRequest(
        bandName.trim(),
        getToken,
      );
      await refreshSession();
      setActiveBandId(band.id);
      onCreated?.(band.id, inviteCode);
      onClose();
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

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Create new band"
      description="Start a separate workspace. You can switch between bands anytime."
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? "Creating…" : "Create band"}
          </Button>
        </>
      }
    >
      <FormField label="Band name" htmlFor="new-band-name" error={error ?? undefined}>
        <Input
          id="new-band-name"
          placeholder="Side project, cover band…"
          value={bandName}
          onChange={(event) => {
            setBandName(event.target.value);
            if (error) setError(null);
          }}
          disabled={submitting}
          autoFocus
        />
      </FormField>
    </ModalDialog>
  );
}
