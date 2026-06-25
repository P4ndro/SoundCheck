import type { MeResponse } from "@/services/api-client";
import { createContext } from "react";

export interface BandSummary {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
}

export interface ActiveBandContextValue {
  bands: BandSummary[];
  activeBand: BandSummary | null;
  setActiveBandId: (bandId: string) => void;
}

export const ACTIVE_BAND_STORAGE_KEY = "soundcheck:activeBandId";

export const ActiveBandContext =
  createContext<ActiveBandContextValue | null>(null);

export type { MeResponse };
