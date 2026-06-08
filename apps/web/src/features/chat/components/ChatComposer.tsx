import { cn } from "@/lib/cn";
import { ArrowUp, ImagePlus, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

export interface ChatComposerProps {
  onSend: (payload: { text?: string; imageUrl?: string }) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend = Boolean(text.trim() || imagePreview) && !disabled;

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (file: File | undefined) => {
    if (!file?.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!canSend) return;

    onSend({
      text: text.trim() || undefined,
      imageUrl: imagePreview ?? undefined,
    });
    setText("");
    clearImage();
  };

  return (
    <footer className="shrink-0 border-t border-border bg-surface-1 px-6 py-3.5">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative shrink-0 overflow-hidden rounded-lg border border-border">
            <img
              src={imagePreview}
              alt="Attachment"
              className="h-14 w-14 object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
              aria-label="Remove photo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="text-xs text-muted">Photo attached</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 text-muted transition-colors hover:text-foreground disabled:opacity-50"
          aria-label="Upload photo"
        >
          <ImagePlus className="h-4 w-4" />
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Message the band…"
          rows={1}
          disabled={disabled}
          className={cn(
            "max-h-24 min-h-9 min-w-0 flex-1 resize-none rounded-md border border-border bg-surface-1 px-3 py-2",
            "text-sm text-foreground placeholder:text-subtle",
            "focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-subtle",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />

        <button
          type="submit"
          disabled={!canSend}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors",
            canSend
              ? "bg-accent text-foreground hover:bg-accent-hover"
              : "border border-border bg-surface-1 text-subtle",
          )}
          aria-label="Send message"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
    </footer>
  );
}
