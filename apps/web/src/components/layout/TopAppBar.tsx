import { BandSwitcher } from "@/components/layout/BandSwitcher";
import { UserMenu } from "@/components/layout/UserMenu";
import { Input } from "@/components/ui/Input";
import { CreateBandModal } from "@/features/band/components/CreateBandModal";
import { JoinBandModal } from "@/features/band/components/JoinBandModal";
import { Search } from "lucide-react";
import { useState, type ReactNode } from "react";

export interface TopAppBarProps {
  title: string;
  actions?: ReactNode;
}

export function TopAppBar({ title, actions }: TopAppBarProps) {
  const [createBandOpen, setCreateBandOpen] = useState(false);
  const [joinBandOpen, setJoinBandOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-(--topbar-height) shrink-0 items-center gap-4 border-b border-border bg-surface-1/95 px-6 backdrop-blur-sm">
        <h1 className="shrink-0 text-base font-semibold text-foreground">
          {title}
        </h1>

        <BandSwitcher
          onCreateBand={() => setCreateBandOpen(true)}
          onJoinBand={() => setJoinBandOpen(true)}
        />

        <div className="relative mx-auto hidden w-full max-w-md lg:block">
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

      <CreateBandModal
        open={createBandOpen}
        onClose={() => setCreateBandOpen(false)}
      />
      <JoinBandModal
        open={joinBandOpen}
        onClose={() => setJoinBandOpen(false)}
      />
    </>
  );
}
