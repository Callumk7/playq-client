import { followers, gamesOnPlaylists, playlists } from "db/schema/playlists";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { GameWithCover } from "./games";

export const playlistsSelectSchema = createSelectSchema(playlists);
export const playlistsInsertSchema = createInsertSchema(playlists);

export const gamesOnPlaylistsSelectSchema = createSelectSchema(gamesOnPlaylists);
export const gamesOnPlaylistsInsertSchema = createInsertSchema(gamesOnPlaylists);

export const followersSelectSchema = createSelectSchema(followers);
export const followersInsertSchema = createInsertSchema(followers);

export type Playlist = z.infer<typeof playlistsSelectSchema>;
export type InsertPlaylist = z.infer<typeof playlistsInsertSchema>;

export type GamesOnPlaylist = z.infer<typeof gamesOnPlaylistsSelectSchema>;
export type InsertGamesOnPlaylist = z.infer<typeof gamesOnPlaylistsInsertSchema>;

export type Followers = z.infer<typeof followersSelectSchema>;
export type InsertFollowers = z.infer<typeof followersInsertSchema>;

export type GamesOnPlaylistWithGameData = GamesOnPlaylist & {
	game: GameWithCover
}

export type PlaylistWithGames = Playlist & {
	games: GamesOnPlaylistWithGameData[]
}

export type PlaylistWithFollowers = Playlist & {
	followers: Followers[]
}
