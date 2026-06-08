import type { Setlist, Song } from "@/types";

export function filterSongsByTitle(songs: Song[], query: string): Song[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return songs;
  return songs.filter((song) =>
    song.title.toLowerCase().includes(normalized),
  );
}

export function songsNotInSetlist(songs: Song[], setlist: Setlist): Song[] {
  const inSet = new Set(setlist.songIds);
  return songs.filter((song) => !inSet.has(song.id));
}

export function resolveSetlistSongs(
  setlist: Setlist,
  getSong: (id: string) => Song | undefined,
): Song[] {
  return setlist.songIds
    .map((songId) => getSong(songId))
    .filter((song): song is Song => song !== undefined);
}
