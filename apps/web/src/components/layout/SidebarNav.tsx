import { Button } from "@/components/ui/Button";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { SidebarContextPanel } from "@/components/layout/SidebarContextPanel";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import { cn } from "@/lib/cn";
import { primaryNav, settingsNav } from "@/lib/navigation";
import { useToast } from "@/providers/ToastProvider";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

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

export function SidebarNav({ collapsed, onToggleCollapse }: SidebarNavProps) {
  const { band, currentUser } = useBandWorkspace();
  const { toast } = useToast();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const handleSignOut = () => {
    setSignOutOpen(false);
    toast("Signed out — auth connects in a later phase", "info");
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
          {primaryNav.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              title={collapsed ? label : undefined}
              className={({ isActive }) => sidebarLinkClass(collapsed, isActive)}
            >
              <Icon className={navIconClass} strokeWidth={1.75} />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
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
        description="You'll return to the sign-in screen once authentication is connected."
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
