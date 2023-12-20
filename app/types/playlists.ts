import { gamesOnPlaylists, playlists } from "db/schema/playlists";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const playlistsSelectSchema = createSelectSchema(playlists);
export const playlistsInsertSchema = createInsertSchema(playlists);

export const gamesOnPlaylistsSelectSchema = createSelectSchema(gamesOnPlaylists);
export const gamesOnPlaylistsInsertSchema = createInsertSchema(gamesOnPlaylists);

export type Playlist = z.infer<typeof playlistsSelectSchema>;
export type InsertPlaylist = z.infer<typeof playlistsInsertSchema>;

export type GamesOnPlaylist = z.infer<typeof gamesOnPlaylistsSelectSchema>;
export type InsertGamesOnPlaylist = z.infer<typeof gamesOnPlaylistsInsertSchema>;
