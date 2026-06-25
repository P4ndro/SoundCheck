import { Button } from "@/components/ui/Button";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { SidebarContextPanel } from "@/components/layout/SidebarContextPanel";
import { useActiveBand } from "@/hooks/useActiveBand";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import { useChatUnread } from "@/hooks/useChatUnread";
import { cn } from "@/lib/cn";
import { primaryNav, settingsNav } from "@/lib/navigation";
import { useToast } from "@/providers/ToastProvider";
import { useClerk } from "@clerk/clerk-react";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { NavLink, useMatch, useNavigate } from "react-router-dom";

export interface SidebarNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function sidebarLinkClass(collapsed: boolean, isActive: boolean) {
  return cn(
    "flex items-center rounded-lg font-medium transition-colors",
    collapsed
      ? "justify-center px-2.5 py-3"
      : "gap-3.5 px-4 py-2.5 text-[15px]",
    isActive
      ? "bg-accent-subtle text-foreground"
      : "text-muted hover:bg-surface-2 hover:text-foreground",
  );
}

const navIconClass = "h-5 w-5 shrink-0";

function ChatNavBadge({
  count,
  collapsed,
}: {
  count: number;
  collapsed: boolean;
}) {
  if (collapsed) {
    return (
      <span
        className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-surface-1"
        aria-hidden
      />
    );
  }

  return (
    <span
      className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-foreground ring-2 ring-surface-1"
      aria-hidden
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function SidebarNav({ collapsed, onToggleCollapse }: SidebarNavProps) {
  const { band, currentUser } = useBandWorkspace();
  const { activeBand } = useActiveBand();
  const { unreadCount, hasUnread } = useChatUnread(
    activeBand?.id,
    currentUser.id,
  );
  const { toast } = useToast();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const isOnChatRoute = useMatch("/chat") != null;
  const [signOutOpen, setSignOutOpen] = useState(false);

  const handleSignOut = async () => {
    setSignOutOpen(false);
    await signOut();
    toast("Signed out", "info");
    navigate("/login");
  };

  return (
    <>
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-border bg-surface-1 transition-[width] duration-200",
          collapsed ? "w-(--sidebar-collapsed-width)" : "w-(--sidebar-width)",
        )}
      >
        <div
          className={cn(
            "flex h-(--topbar-height) shrink-0 items-center border-b border-border",
            collapsed ? "justify-center px-2.5" : "justify-between px-5",
          )}
        >
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">
                Soundcheck
              </p>
              <p className="truncate text-sm text-subtle">{band.name}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn("shrink-0", collapsed && "px-2")}
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="shrink-0 space-y-1 p-3" aria-label="Primary">
          {primaryNav.map(({ label, href, icon: Icon }) => {
            const isChat = href === "/chat";
            const showUnread = isChat && hasUnread && !isOnChatRoute;

            return (
              <NavLink
                key={href}
                to={href}
                title={
                  collapsed
                    ? showUnread
                      ? `${label} (${unreadCount} unread)`
                      : label
                    : undefined
                }
                aria-label={
                  showUnread ? `${label}, ${unreadCount} unread` : label
                }
                className={({ isActive }) =>
                  sidebarLinkClass(collapsed, isActive)
                }
              >
                <span className="relative shrink-0">
                  <Icon className={navIconClass} strokeWidth={1.75} />
                  {showUnread && (
                    <ChatNavBadge count={unreadCount} collapsed={collapsed} />
                  )}
                </span>
                {!collapsed && (
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-2 truncate">
                    <span className="truncate">{label}</span>
                    {showUnread && (
                      <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold leading-none text-foreground">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <SidebarContextPanel collapsed={collapsed} />

        <div className="mt-auto shrink-0 space-y-1 border-t border-border p-3">
          <NavLink
            to={settingsNav.href}
            title={collapsed ? settingsNav.label : undefined}
            className={({ isActive }) => sidebarLinkClass(collapsed, isActive)}
          >
            <settingsNav.icon className={navIconClass} strokeWidth={1.75} />
            {!collapsed && <span>{settingsNav.label}</span>}
          </NavLink>

          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            title={collapsed ? "Sign out" : undefined}
            className={cn(
              sidebarLinkClass(collapsed, false),
              "w-full",
            )}
          >
            <LogOut className={navIconClass} strokeWidth={1.75} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <ModalDialog
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        title="Sign out?"
        description="You'll return to the log-in screen."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSignOutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSignOut}>Sign out</Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Signed in as{" "}
          <span className="text-foreground">{currentUser.email}</span>
        </p>
      </ModalDialog>
    </>
  );
}
