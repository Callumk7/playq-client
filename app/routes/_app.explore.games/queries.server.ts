import { IGDB_BASE_URL } from "@/constants";
import { getUserCollectionGameIds } from "@/model";
import { FetchOptions, fetchGamesFromIGDB } from "@/services";
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
