import type { MeResponse } from "@/services/api-client";
import { createContext } from "react";

export interface SessionContextValue {
  session: MeResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
