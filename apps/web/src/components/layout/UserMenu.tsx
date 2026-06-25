import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import { getMemberLabel } from "@/lib/roles";
import { getInitials } from "@/lib/user";
import { cn } from "@/lib/cn";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function UserMenu() {
  const { currentUser, members, users } = useBandWorkspace();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const member = members.find((m) => m.userId === currentUser.id);
  const roleLabel = member
    ? getMemberLabel(member, users).role
    : "Member";

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          "border border-border bg-surface-2 text-xs font-medium text-muted",
          "hover:border-accent/40 hover:text-foreground",
          open && "border-accent/40 text-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${currentUser.name} profile`}
      >
        {getInitials(currentUser.name)}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-52 rounded-lg border border-border bg-surface-2 py-1 shadow-xl">
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-medium text-foreground">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-subtle">{roleLabel}</p>
            {currentUser.email && (
              <p className="mt-1 truncate text-xs text-muted">
                {currentUser.email}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(`/settings/members/${currentUser.id}`);
            }}
            className="w-full px-3 py-2 text-left text-sm text-muted hover:bg-surface-1 hover:text-foreground"
          >
            View profile
          </button>
        </div>
      )}
    </div>
  );
}
