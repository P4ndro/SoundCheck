import { ActiveBandContext } from "@/context/active-band-context";
import { useContext } from "react";

export function useActiveBand() {
  const context = useContext(ActiveBandContext);

  if (!context) {
    throw new Error("useActiveBand must be used within ActiveBandProvider");
  }

  return context;
}
