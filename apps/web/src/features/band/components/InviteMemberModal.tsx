import { Button } from "@/components/ui/Button";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { formatInviteCodeForDisplay } from "@/lib/invite-code";
import { useToast } from "@/providers/ToastProvider";
import { fetchBandInvite } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { Copy, Link2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  bandId: string | undefined;
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function InviteMemberModal({
  open,
  onClose,
  bandId,
}: InviteMemberModalProps) {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<{
    code: string;
    shareUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!open || !bandId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setInvite(null);

    void fetchBandInvite(bandId, getToken)
      .then((data) => {
        if (cancelled) return;
        setInvite({ code: data.code, shareUrl: data.shareUrl });
      })
      .catch((fetchError) => {
        if (cancelled) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load invite code",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, bandId, getToken]);

  const handleCopy = async (value: string, label: string) => {
    try {
      await copyText(value);
      toast(`${label} copied`, "info");
    } catch {
      toast("Could not copy to clipboard", "info");
    }
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Invite member"
      description="Share this code or link with someone you want in the band."
      size="sm"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      }
    >
      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading invite…
        </div>
      )}

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {invite && !loading && (
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted">Invite code</p>
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-1 p-3">
              <code className="flex-1 font-mono text-sm tracking-wider text-foreground">
                {formatInviteCodeForDisplay(invite.code)}
              </code>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => void handleCopy(invite.code, "Invite code")}
                aria-label="Copy invite code"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted">Invite link</p>
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-1 p-3">
              <Link2 className="h-4 w-4 shrink-0 text-subtle" />
              <code className="min-w-0 flex-1 truncate text-sm text-muted">
                {invite.shareUrl}
              </code>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => void handleCopy(invite.shareUrl, "Invite link")}
                aria-label="Copy invite link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-subtle">
            Anyone with this link still needs a SoundCheck account and your
            invite code to join.
          </p>
        </div>
      )}
    </ModalDialog>
  );
}
