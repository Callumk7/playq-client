import { IGDBGame } from "@/types/igdb";

export const markResultsAsSaved = (
	searchResults: IGDBGame[],
	userCollection: number[],
) => {
	return searchResults.map((game) => {
		if (userCollection.includes(game.id)) {
			return {
				...game,
				saved: true,
			};
		} else {
			return {
				...game,
				saved: false,
			};
		}
	});
};
