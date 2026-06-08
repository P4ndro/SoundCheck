import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

export interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
};

export function ModalDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  size = "md",
}: ModalDialogProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[3px] transition-opacity"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden rounded-xl border border-border/90 bg-surface-2 shadow-2xl shadow-black/50 ring-1 ring-white/4",
          "max-h-[min(calc(100vh-2rem),720px)]",
          sizeStyles[size],
          className,
        )}
      >
        <div className="shrink-0 border-b border-border/80 bg-surface-1/30 px-5 py-4">
          <div className="flex items-start gap-3">
            <div
              className="mt-1 h-8 w-1 shrink-0 rounded-full bg-accent/80"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <h2
                id="modal-title"
                className="text-[15px] font-semibold tracking-tight text-foreground"
              >
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 shrink-0 text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 py-4">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 flex items-center justify-end gap-2 border-t border-border/80 bg-surface-1/40 px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
