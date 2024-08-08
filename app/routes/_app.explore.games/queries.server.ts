import { IGDB_BASE_URL } from "@/constants";
import { getUserCollectionGameIds } from "@/model";
import { FetchOptions, IGDBClient, fetchGamesFromIGDB } from "@/services";
import { IGDBGame, IGDBGameSchemaArray } from "@/types";

type GetSearchResultsOptions = {
	userId: string;
	search: string | null;
	offset: number | null;
};
export async function getSearchResults({
	userId,
	search,
	offset,
}: GetSearchResultsOptions) {
	let searchResults: IGDBGame[] = [];
	const searchOptions: FetchOptions = {
		fields: ["name", "cover.image_id"],
		limit: 50,
		filters: [
			"cover != null",
			"parent_game = null",
			"version_parent = null",
			"themes != (42)",
		],
	};

	if (offset) {
		searchOptions.offset = offset;
	}

	if (search) {
		searchOptions.search = search;
	} else {
		searchOptions.sort = ["rating desc"];
		searchOptions.filters?.push("follows > 250", "rating > 80");
	}

	const resultsPromise = fetchGamesFromIGDB(IGDB_BASE_URL, searchOptions);
	const gameIdsPromise = getUserCollectionGameIds(userId);

	const [results, gameIds] = await Promise.all([resultsPromise, gameIdsPromise]);

	try {
		const parsedGames = IGDBGameSchemaArray.parse(results);
		searchResults = parsedGames;
	} catch (e) {
		console.error(e);
	}
	const resultsMarkedAsSaved = markResultsAsSaved(searchResults, gameIds);

	return resultsMarkedAsSaved;
}

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

	const searchResults = IGDBGameSchemaArray.parse(games);

	return searchResults;
}

export async function getSearchResultsNew(
	query: string | null,
	page: string | null
) {
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

	console.log(games);

	return games;
}
