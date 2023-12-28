import { z } from "zod";

// Action Requests
export const insertGameToPlaylistSchema = z.object({
	gameId: z.number(),
	addedBy: z.string(),
})

export type InsertGameToPlaylist = z.infer<typeof insertGameToPlaylistSchema>;
