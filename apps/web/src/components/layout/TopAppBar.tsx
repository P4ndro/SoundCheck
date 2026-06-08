import { UserMenu } from "@/components/layout/UserMenu";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import type { ReactNode } from "react";

export interface TopAppBarProps {
  title: string;
  actions?: ReactNode;
}

export function TopAppBar({ title, actions }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-(--topbar-height) shrink-0 items-center gap-4 border-b border-border bg-surface-1/95 px-6 backdrop-blur-sm">
      <h1 className="shrink-0 text-base font-semibold text-foreground">
        {title}
      </h1>

      <div className="relative mx-auto w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-subtle" />
        <Input
          className="pl-9"
          placeholder="Search songs, setlists, events..."
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        {actions}
        <UserMenu />
      </div>
    </header>
  );
}
