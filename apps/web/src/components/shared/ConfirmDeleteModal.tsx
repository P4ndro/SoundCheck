import { Button } from "@/components/ui/Button";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { AlertTriangle } from "lucide-react";

export interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: "song" | "setlist";
  itemName: string;
}

const deleteLabels = {
  song: "song",
  setlist: "setlist",
} as const;

const lossDetails = {
  song: "Lyrics, notation, and any setlist references will be permanently removed.",
  setlist: "This setlist and its song order will be permanently removed.",
} as const;

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  itemType,
  itemName,
}: ConfirmDeleteModalProps) {
  const label = deleteLabels[itemType];

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title={`Delete ${label}?`}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete {label}
          </Button>
        </>
      }
    >
      <div className="flex gap-3 rounded-lg border border-danger/25 bg-danger-subtle p-4">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-danger"
          aria-hidden
        />
        <div className="text-sm leading-relaxed text-muted">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{itemName}</span>?
          </p>
          <p className="mt-2">{lossDetails[itemType]}</p>
        </div>
      </div>
    </ModalDialog>
  );
}
