import type { InstrumentTab } from "@/types";

export function hasUserCapo(tab: InstrumentTab): boolean {
  return tab.capo != null && tab.capo > 0;
}

export function tabCapoForDisplay(tab: InstrumentTab): number | undefined {
  if (tab.capo != null && tab.capo > 0) return tab.capo;
  return undefined;
}
