import type { BandWorkspace } from "@/types";

export const emptyWorkspace: BandWorkspace = {
  currentUser: {
    id: "",
    name: "",
  },
  band: {
    id: "",
    name: "",
    createdAt: new Date(0).toISOString(),
  },
  members: [],
  users: [],
  songs: [],
  setlists: [],
  events: [],
};
