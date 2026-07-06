import { describe, expect, it } from "vitest";
import {
  filterSongsByTitle,
  resolveSetlistSongs,
  songsNotInSetlist,
} from "./song-utils";
import type { Setlist, Song } from "@/types";

const songs: Song[] = [
  {
    id: "song-1",
    bandId: "band-1",
    title: "Neon Cathedral",
    bpm: 120,
    timeSignature: "4/4",
    durationSeconds: 240,
    status: "in_progress",
    key: "Am",
    tuning: "E A D G",
    lyrics: "",
    notes: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "song-2",
    bandId: "band-1",
    title: "Midnight Relay",
    bpm: 90,
    timeSignature: "4/4",
    durationSeconds: 200,
    status: "not_started",
    key: "Em",
    tuning: "E A D G",
    lyrics: "",
    notes: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const setlist: Setlist = {
  id: "setlist-1",
  bandId: "band-1",
  name: "Gig",
  description: "",
  songIds: ["song-1"],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("filterSongsByTitle", () => {
  it("returns all songs when query is empty", () => {
    expect(filterSongsByTitle(songs, "")).toHaveLength(2);
  });

  it("filters by case-insensitive title match", () => {
    expect(filterSongsByTitle(songs, "neon")).toEqual([songs[0]]);
  });

  it("returns empty when nothing matches", () => {
    expect(filterSongsByTitle(songs, "missing")).toEqual([]);
  });
});

describe("songsNotInSetlist", () => {
  it("excludes songs already in the setlist", () => {
    expect(songsNotInSetlist(songs, setlist)).toEqual([songs[1]]);
  });
});

describe("resolveSetlistSongs", () => {
  it("preserves setlist order and skips missing songs", () => {
    const getSong = (id: string) => songs.find((song) => song.id === id);
    expect(resolveSetlistSongs(setlist, getSong)).toEqual([songs[0]]);
    expect(
      resolveSetlistSongs(
        { ...setlist, songIds: ["song-2", "missing", "song-1"] },
        getSong,
      ),
    ).toEqual([songs[1], songs[0]]);
  });
});
