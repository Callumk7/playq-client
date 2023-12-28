import { z } from "zod";
import { zx } from "zodix";

// Action Requests

export const gameToCollectionSchema = z.object({
	gameId: zx.NumAsString,
	userId: z.string(),
})

export const gameToPlaylistSchema = z.object({
	gameId: zx.NumAsString,
	addedBy: z.string(),
})

export type GameIntoCollection = z.infer<typeof gameToCollectionSchema>;
export type GameIntoPlaylist = z.infer<typeof gameToPlaylistSchema>;
