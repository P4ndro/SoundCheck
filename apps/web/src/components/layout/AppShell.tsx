import { cn } from "@/lib/cn";
import { routeTitles } from "@/lib/navigation";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { TopAppBar } from "./TopAppBar";

function resolveTitle(pathname: string): string {
  if (routeTitles[pathname]) {
    return routeTitles[pathname];
  }

  const base = `/${pathname.split("/")[1] ?? ""}`;
  return routeTitles[base] ?? "Soundcheck";
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const title = resolveTitle(pathname);
  const isFullHeightPage = pathname === "/tabs" || pathname === "/chat";

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-background">
      <SidebarNav
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopAppBar title={title} />
        <main
          className={cn(
            "flex h-0 min-h-0 flex-1 flex-col overscroll-y-contain",
            isFullHeightPage
              ? "overflow-hidden"
              : "scroll-smooth-touch overflow-auto",
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
