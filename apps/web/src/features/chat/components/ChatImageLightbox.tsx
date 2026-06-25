import { X } from "lucide-react";
import { useEffect } from "react";

export interface ChatImageLightboxProps {
  imageUrl: string;
  caption?: string;
  onClose: () => void;
}

export function ChatImageLightbox({
  imageUrl,
  caption,
  onClose,
}: ChatImageLightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/92"
      role="dialog"
      aria-modal="true"
      aria-label="Photo preview"
    >
      <header className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
        <p className="truncate text-sm text-white/70">
          {caption ?? "Shared photo"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close photo"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <button
        type="button"
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Close photo"
      />

      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-6">
        <img
          src={imageUrl}
          alt={caption ?? "Shared photo"}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {caption && (
        <footer className="shrink-0 border-t border-white/10 px-4 py-3 text-center text-sm text-white/80 sm:px-6">
          {caption}
        </footer>
      )}
    </div>
  );
}

export interface ChatImagePreview {
  imageUrl: string;
  caption?: string;
}
