import type { BandWorkspace } from "@/types";
import type { Dispatch, SetStateAction } from "react";

export function runWorkspaceMutation<T>(
  setWorkspace: Dispatch<SetStateAction<BandWorkspace>>,
  mutate: (prev: BandWorkspace) => { workspace: BandWorkspace; result: T },
): T {
  let result!: T;
  setWorkspace((prev) => {
    const outcome = mutate(prev);
    result = outcome.result;
    return outcome.workspace;
  });
  return result;
}
