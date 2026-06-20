import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { AppGate } from "@/features/onboarding/components/OnboardingGuards";
import { Button } from "@/components/ui/Button";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";

function WorkspaceGate() {
  const { isLoading, error, reloadWorkspace } = useBandWorkspace();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex h-full min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <div className="max-w-md space-y-2">
          <h1 className="text-lg font-semibold text-foreground">
            Could not load workspace
          </h1>
          <p className="text-sm text-muted">{error}</p>
        </div>
        <Button onClick={() => void reloadWorkspace()}>Try again</Button>
      </div>
    );
  }

  return <AppShell />;
}

export function ProtectedAppShell() {
  return (
    <AuthGuard>
      <AppGate>
        <WorkspaceGate />
      </AppGate>
    </AuthGuard>
  );
}
