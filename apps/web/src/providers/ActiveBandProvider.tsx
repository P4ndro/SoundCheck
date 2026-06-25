import {
  ACTIVE_BAND_STORAGE_KEY,
  ActiveBandContext,
  type ActiveBandContextValue,
  type BandSummary,
} from "@/context/active-band-context";
import { useSession } from "@/hooks/useSession";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

function resolveActiveBand(
  bands: BandSummary[],
  storedBandId: string | null,
): BandSummary | null {
  if (!bands.length) return null;

  if (storedBandId) {
    const match = bands.find((band) => band.id === storedBandId);
    if (match) return match;
  }

  return bands[0] ?? null;
}

export function ActiveBandProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const bands = session?.bands ?? [];
  const [storedBandId, setStoredBandId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_BAND_STORAGE_KEY);
  });

  const activeBand = useMemo(
    () => resolveActiveBand(bands, storedBandId),
    [bands, storedBandId],
  );

  useEffect(() => {
    if (!activeBand) return;

    if (storedBandId !== activeBand.id) {
      localStorage.setItem(ACTIVE_BAND_STORAGE_KEY, activeBand.id);
      setStoredBandId(activeBand.id);
    }
  }, [activeBand, storedBandId]);

  const setActiveBandId = useCallback((bandId: string) => {
    localStorage.setItem(ACTIVE_BAND_STORAGE_KEY, bandId);
    setStoredBandId(bandId);
  }, []);

  const value = useMemo<ActiveBandContextValue>(
    () => ({
      bands,
      activeBand,
      setActiveBandId,
    }),
    [bands, activeBand, setActiveBandId],
  );

  return (
    <ActiveBandContext.Provider value={value}>
      {children}
    </ActiveBandContext.Provider>
  );
}
