import { cn } from "@/lib/cn";
import { ArrowUp, ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

export interface ChatComposerProps {
  onSend: (payload: { text?: string; imageUrl?: string }) => void;
  disabled?: boolean;
  isSending?: boolean;
}

export function ChatComposer({ onSend, disabled, isSending }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isBusy = Boolean(disabled || isSending);
  const canSend = Boolean(text.trim() || imagePreview) && !isBusy;

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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [text]);

  return (
    <footer className="shrink-0 border-t border-border bg-surface-1 px-4 py-3 sm:px-6">
      <div className="w-full">
        {imagePreview && (
          <div className="mb-2.5 flex items-start gap-3 rounded-lg border border-border bg-surface-2 p-2.5">
            <div className="relative shrink-0 overflow-hidden rounded-md">
              <img
                src={imagePreview}
                alt="Attachment preview"
                className="h-16 w-16 object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                disabled={isBusy}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-white transition-colors hover:bg-black/90 disabled:opacity-50"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-xs font-medium text-foreground">Photo attached</p>
              <p className="mt-0.5 text-[11px] text-subtle">
                Add an optional caption below
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-2xl border border-border bg-surface-2 px-2 py-2"
        >
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
            disabled={isBusy}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-3 hover:text-foreground disabled:opacity-50"
            aria-label="Upload photo"
          >
            <ImagePlus className="h-4 w-4" />
          </button>

          <textarea
            ref={textareaRef}
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
            disabled={isBusy}
            aria-busy={isSending}
            className={cn(
              "max-h-[120px] min-h-9 min-w-0 flex-1 resize-none bg-transparent px-1 py-2",
              "text-sm text-foreground placeholder:text-subtle",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />

          <button
            type="submit"
            disabled={!canSend}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
              canSend
                ? "bg-accent text-foreground hover:bg-accent-hover"
                : "text-subtle",
            )}
            aria-label={isSending ? "Sending message" : "Send message"}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
            )}
          </button>
        </form>

        <p className="mt-1.5 text-right text-[11px] text-subtle">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </footer>
  );
}
