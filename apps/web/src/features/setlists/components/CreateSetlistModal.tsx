import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { Textarea } from "@/components/ui/Textarea";
import { useEffect, useState } from "react";

export interface CreateSetlistModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

export function CreateSetlistModal({
  open,
  onClose,
  onSubmit,
}: CreateSetlistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setNameError("");
  }, [open]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Create setlist"
      description="Name your list — add songs after you create it."
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create setlist</Button>
        </>
      }
    >
      <FormSection title="Setlist">
        <FormField label="Name" htmlFor="setlist-name" error={nameError}>
          <Input
            id="setlist-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="e.g. Summer tour opener"
            autoFocus
          />
        </FormField>
        <FormField
          label="Description"
          htmlFor="setlist-description"
          hint="Optional — venue, vibe, or notes"
        >
          <Textarea
            id="setlist-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="High-energy set for outdoor gigs..."
            rows={2}
            className="min-h-[56px] resize-y"
          />
        </FormField>
      </FormSection>
    </ModalDialog>
  );
}
