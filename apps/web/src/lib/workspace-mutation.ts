import type { BandWorkspace } from "@/types";

export type PatchWorkspace = (
  updater: (prev: BandWorkspace) => BandWorkspace,
) => void;

export function runWorkspaceMutation<T>(
  patchWorkspace: PatchWorkspace,
  mutate: (prev: BandWorkspace) => { workspace: BandWorkspace; result: T },
): T {
  let result!: T;
  patchWorkspace((prev) => {
    const outcome = mutate(prev);
    result = outcome.result;
    return outcome.workspace;
  });
  return result;
}
