import { ApiError } from "../middleware/error-handler.js";
import type { BandRole, Instrument } from "@prisma/client";

export function instrumentForMemberRole(role: BandRole): Instrument {
  if (role === "custom") {
    throw new ApiError(403, "Custom roles cannot edit instrument notation");
  }

  return role;
}

export function assertCanEditTabInstrument(
  role: BandRole,
  instrument: Instrument,
): void {
  const allowed = instrumentForMemberRole(role);

  if (allowed !== instrument) {
    throw new ApiError(403, "You can only edit notation for your own instrument");
  }
}
