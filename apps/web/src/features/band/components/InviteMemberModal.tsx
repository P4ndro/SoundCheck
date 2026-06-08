import { Button } from "@/components/ui/Button";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { Link2 } from "lucide-react";

export interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  inviteUrl?: string;
}

export function InviteMemberModal({
  open,
  onClose,
  inviteUrl = "https://soundcheck.app/join/the-marlowe-demo",
}: InviteMemberModalProps) {
  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Invite member"
      description="Share this link with someone you want to join the band."
      size="sm"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface-1 p-3">
        <Link2 className="h-4 w-4 shrink-0 text-subtle" />
        <code className="truncate text-sm text-muted">{inviteUrl}</code>
      </div>
      <p className="mt-3 text-xs text-subtle">
        Invite links will be functional once authentication is connected.
      </p>
    </ModalDialog>
  );
}
