import {
	followers,
	gamesOnPlaylists,
	playlistComments,
	playlists,
} from "db/schema/playlists";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Game, GameWithCover } from "./games";
import { User } from ".";

export const playlistsSelectSchema = createSelectSchema(playlists);
export const playlistsInsertSchema = createInsertSchema(playlists);

export const gamesOnPlaylistsSelectSchema = createSelectSchema(gamesOnPlaylists);
export const gamesOnPlaylistsInsertSchema = createInsertSchema(gamesOnPlaylists);

export const followersSelectSchema = createSelectSchema(followers);
export const followersInsertSchema = createInsertSchema(followers);

export const playlistCommentsSelectSchema = createSelectSchema(playlistComments);
export const playlistCommentsInsertSchema = createInsertSchema(playlistComments);

export type Playlist = z.infer<typeof playlistsSelectSchema>;
export type InsertPlaylist = z.infer<typeof playlistsInsertSchema>;

export type GamesOnPlaylist = z.infer<typeof gamesOnPlaylistsSelectSchema>;
export type InsertGamesOnPlaylist = z.infer<typeof gamesOnPlaylistsInsertSchema>;

export type Follower = z.infer<typeof followersSelectSchema>;
export type InsertFollower = z.infer<typeof followersInsertSchema>;

export type PlaylistComment = z.infer<typeof playlistCommentsSelectSchema>;
export type InsertPlaylistComment = z.infer<typeof playlistCommentsInsertSchema>;

export type GamesOnPlaylistWithGameData = GamesOnPlaylist & {
	game: GameWithCover;
};

export type PlaylistWithGames = Playlist & {
	games: GamesOnPlaylistWithGameData[];
};

export type PlaylistWithCreator = Playlist & {
	creator: User;
};

export type PlaylistWithGamesAndCreator = Playlist & {
	games: GamesOnPlaylist[];
	creator: User;
};

export type PlaylistWithFollowers = Playlist & {
	followers: Follower[];
};

export type PlaylistCommentsWithAuthor = PlaylistComment & {
	author: User;
};

export type PlaylistWithPinned = Playlist & {
	pinned: boolean;
};

export type GamesOnPlaylistWithPlaylist = GamesOnPlaylist & {
	playlist: Playlist;
};
