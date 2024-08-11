// we are going to get the top rated games from IGDB, with an offset, and write them to the database
// we will also want to get a cache available for the games that we already have in the db. This
// doesn't really need to be a full featured solution yet, as this script is going to be run ad-hoc
// when needed.

import { IGDB_BASE_URL } from "@/constants";
import { IGDBClient, SaveGameService, fetchGamesFromIGDB } from "@/services";
import { IGDBGameSchemaArray } from "@/types/igdb";
import { db } from "db";
import { games } from "db/schema/games";

// Adding our own service instead of cloudflare
const client = new IGDBClient(
	process.env.IGDB_CLIENT_ID!,
	process.env.IGDB_BEARER_TOKEN!,
);

//async function getAllGamesFromDb(): Promise<number[]> {
//	const allGames = await db
//		.select({
//			id: games.gameId,
//		})
//		.from(games);
//
//	const gameIds = allGames.map((game) => game.id);
//	return gameIds;
//}
//
//// This is the cache
//const gameIds = await getAllGamesFromDb();

// Now we get all the games and game data that we want
for (let i = 0; i < 20; i++) {
	const games = await client.execute(
		"games",
		client
			.games("full")
			.sort("rating", "desc")
			.where("cover != null")
			.limit(500)
			.offset(i * 500),
	);
	//const games = await fetchGamesFromIGDB(IGDB_BASE_URL, {
	//	fields: "full",
	//	limit: 500,
	//	sort: ["rating desc"],
	//	offset: i * 500,
	//	filters: ["follows > 7", "cover != null"],
	//});
	
	console.log(games)

	const parsedGames = IGDBGameSchemaArray.parse(games);
	console.log(parsedGames)

	// filter out games that we already have..
	//const filteredGames = parsedGames.filter((game) => !gameIds.includes(game.id));
	//console.log(parsedGames.length - filteredGames.length);
	//console.log("..games removed from the fetch");

	//if (filteredGames.length === 0) {
	//	console.log("Looks like we have all these ones chief.. skipping");
	//	continue;
	//}

	const service = new SaveGameService(db, client);
	console.log("Saving games to database...");
	await service.saveGamesToDatabase(parsedGames).catch((e) => console.error(e)); // add error handling and routing
}
