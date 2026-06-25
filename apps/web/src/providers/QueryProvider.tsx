import { queryClient } from "@/lib/query-client";
import { useAuth } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      queryClient.clear();
    }
  }, [isSignedIn]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
