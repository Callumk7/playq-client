import { IGDBClient } from "@/services";
import { IGDBGame, IGDBGameSchema, IGDBGameSchemaArray } from "@/types";

// WARN: Not currently used. Should be applied to results from IGDB to ensure
// that the correct state of the game is captured.
const markResultsAsSaved = (searchResults: IGDBGame[], userCollection: number[]) => {
	return searchResults.map((game) => {
		if (userCollection.includes(game.id)) {
			return {
				...game,
				saved: true,
			};
		}
		return {
			...game,
			saved: false,
		};
	});
};

const client = new IGDBClient(
	process.env.IGDB_CLIENT_ID!,
	process.env.IGDB_BEARER_TOKEN!,
);

export async function getTopRatedRecentGames() {
	const games = await client.execute(
		"games",
		client
			.games("full")
			.where("release_dates.y >= 2015")
			.where("aggregated_rating_count >= 20")
			.sort("aggregated_rating", "desc")
			.limit(30),
	);

	console.log(games);

	const parsedResults = [];
	for (const game of games) {
		const result = IGDBGameSchema.safeParse(game);
		if (result.success) {
			parsedResults.push(result.data);
		}
	}

	return parsedResults;
}

export async function getSearchResultsNew(query: string | null, page: string | null) {
	const limit = 25;
	let offset: number | null = null;

	if (page === null) {
		offset = 0;
	} else {
		offset = Number(page) * limit;
	}

	const games = await client.execute(
		"games",
		client.games("full").search(query).limit(limit).offset(offset),
	);

	const parsedResults = [];
	for (const game of games) {
		const result = IGDBGameSchema.safeParse(game);
		if (result.success) {
			parsedResults.push(result.data);
		}
	}

	return parsedResults;
}
