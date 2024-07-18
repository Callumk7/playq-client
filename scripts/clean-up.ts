// need to go through and find all playlist entries that exist without a playlist,
// and remove them..

import { db } from "db";
import { gamesOnPlaylists, playlists } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";

// first, lets get all existing playlist ids...
async function getPlaylistIds() {
	const dbResult = await db
		.select({
			id: playlists.id,
		})
		.from(playlists);

	const allPlaylistIds = dbResult.map((res) => res.id);

	return allPlaylistIds;
}

// now, with that in hand, we will get all entries in the playlist-games table and check
// to see if we still have a playlist, and create a new array for games that need to be removed

async function getAllGamesOnPlaylists() {
	const dbResult = await db
		.select({
			playlistId: gamesOnPlaylists.playlistId,
			gameId: gamesOnPlaylists.gameId,
		})
		.from(gamesOnPlaylists);

	return dbResult;
}

async function main() {
	const allPlaylistIds = await getPlaylistIds();
	const allGamesOnPlaylists = await getAllGamesOnPlaylists();

	const problemEntries: {
		playlistId: string;
		gameId: number;
	}[] = [];

	allGamesOnPlaylists.map((game) => {
		if (!allPlaylistIds.includes(game.playlistId)) {
			problemEntries.push(game);
		}
	});

	console.log(`We have ${problemEntries.length} problems to resolve`);
	console.log("Deleting...");

	 problemEntries.forEach(async (entry) => {
		const result = await db
			.delete(gamesOnPlaylists)
			.where(
				and(
					eq(gamesOnPlaylists.playlistId, entry.playlistId),
					eq(gamesOnPlaylists.gameId, entry.gameId),
				),
			).returning();

		console.log(result);
	});

	console.log("Task completed successfully I think")
}

main();
