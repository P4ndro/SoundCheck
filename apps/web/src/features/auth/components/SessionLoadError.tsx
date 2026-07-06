import { Button } from "@/components/ui/Button";

export function SessionLoadError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="max-w-md space-y-2">
        <h1 className="text-lg font-semibold text-foreground">
          Could not reach the API
        </h1>
        <p className="text-sm text-muted">{error}</p>
        <p className="text-xs text-subtle">
          Clerk sign-in worked, but the app could not load your account from the
          server. On Render free tier, wake the API first via /api/health, then
          retry. Also verify VITE_API_URL on Vercel and CORS_ORIGIN on Render
          match this site URL exactly.
        </p>
      </div>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}
