import { useFilterStore } from "@/store/filters";

export type SortOption =
	| "nameAsc"
	| "nameDesc"
	| "releaseDateAsc"
	| "releaseDateDesc"
	| "rating"
	| "playerRatingAsc"
	| "playerRatingDesc"
	| "dateAddedAsc"
	| "dateAddedDesc";


interface SortableGame {
	title: string;
	aggregatedRating: number | null;
	firstReleaseDate: Date | null;
	playerRating: number | null;
	dateAdded: Date;
}

export const useSort = <G extends SortableGame>(
	games: G[],
) => {
	const sortOption = useFilterStore(state => state.sortOption);
	const sortedGames = applySorting(games, sortOption);

	return {
		sortedGames,
	};
};

const applySorting = <G extends SortableGame>(
	games: G[],
	sortOption: SortOption,
): G[] => {
	const sortedGames = [...games];
	switch (sortOption) {
		case "nameAsc":
			sortedGames.sort((a, b) =>
				a.title.toUpperCase().localeCompare(b.title.toUpperCase()),
			);
			break;

		case "nameDesc":
			sortedGames.sort((a, b) =>
				b.title.toUpperCase().localeCompare(a.title.toUpperCase()),
			);
			break;

		case "rating": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.aggregatedRating === null) {
					bRating = 0;
				} else {
					bRating = b.aggregatedRating;
				}

				if (a.aggregatedRating === null) {
					aRating = 0;
				} else {
					aRating = a.aggregatedRating;
				}
				return bRating - aRating;
			});
			break;
		}

		case "releaseDateAsc": {
			let bReleaseDate = 0;
			let aReleaseDate = 0;
			sortedGames.sort((a, b) => {
				if (b.firstReleaseDate === null) {
					bReleaseDate = 0;
				} else {
					bReleaseDate = b.firstReleaseDate.valueOf();
				}
				if (a.firstReleaseDate === null) {
					aReleaseDate = 0;
				} else {
					aReleaseDate = a.firstReleaseDate.valueOf();
				}
				return aReleaseDate - bReleaseDate;
			});
			break;
		}
		case "releaseDateDesc": {
			let bReleaseDate = 0;
			let aReleaseDate = 0;
			sortedGames.sort((a, b) => {
				if (b.firstReleaseDate === null) {
					bReleaseDate = 0;
				} else {
					bReleaseDate = b.firstReleaseDate.valueOf();
				}
				if (a.firstReleaseDate === null) {
					aReleaseDate = 0;
				} else {
					aReleaseDate = a.firstReleaseDate.valueOf();
				}
				return bReleaseDate - aReleaseDate;
			});
			break;
		}
		case "playerRatingAsc": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.playerRating === null) {
					bRating = 0;
				} else {
					bRating = b.playerRating;
				}

				if (a.playerRating === null) {
					aRating = 0;
				} else {
					aRating = a.playerRating;
				}
				return bRating - aRating;
			});
			break;
		}
		case "playerRatingDesc": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.playerRating === null) {
					bRating = 0;
				} else {
					bRating = b.playerRating;
				}

				if (a.playerRating === null) {
					aRating = 0;
				} else {
					aRating = a.playerRating;
				}
				return aRating - bRating;
			});
			break;
		}
		// TODO: date added is not working correctly.
		// BUG: date added is not working correctly.
		case "dateAddedAsc": {
			sortedGames.sort((a, b) => b.dateAdded.getDate() - a.dateAdded.getDate())
			break;
		}
		case "dateAddedDesc": {
			sortedGames.sort((a, b) => a.dateAdded.getDate() - b.dateAdded.getDate())
			break;
		}
		default:
			break;
	}
	return sortedGames;
};
