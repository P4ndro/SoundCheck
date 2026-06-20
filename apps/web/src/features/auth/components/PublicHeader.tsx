import { BrandMark } from "@/components/layout/BrandMark";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export function PublicHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" aria-hidden />
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <BrandMark />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button size="sm" onClick={() => navigate("/signup")}>
            Create account
          </Button>
        </nav>
      </div>
    </header>
  );
}
