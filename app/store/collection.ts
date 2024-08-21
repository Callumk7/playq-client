import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { FilterState, SortState, ViewState } from "./types";

interface UserCollectionStore extends SortState, FilterState, ViewState {
	selectModeOn: boolean;
	selectedGames: number[];
	hideProgress: boolean;
	setSelectedGames: (selectedGames: number[]) => void;
	setHideProgress: (hideProgress: boolean) => void;
	setSelectModeOn: (selectMode: boolean) => void;
}

export const useCollectionStore = create<UserCollectionStore>()(
	devtools((set) => ({
		genreFilter: [],
		searchTerm: "",
		sortOption: "ratingDesc",
		isTableView: false,
		hideProgress: false,
		selectModeOn: false,
		selectedGames: [],
		filterOnPlayed: false,
		filterOnUnPlayed: false,
		filterOnCompleted: false,
		filterOnUnCompleted: false,
		filterOnRated: false,
		filterOnUnrated: false,
		filterOnStarred: false,
		setGenreFilter: (genreFilter) => set({ genreFilter }),
		setSearchTerm: (searchTerm) => set({ searchTerm }),
		setSortOption: (sortOption) => set({ sortOption }),
		setSelectedGames: (selectedGames) => set({ selectedGames }),
		setHideProgress: (hideProgress) => set({ hideProgress }),
		handleToggleFilterOnPlayed: () =>
			set((state) => ({
				filterOnPlayed: !state.filterOnPlayed,
			})),
		handleToggleFilterOnUnPlayed: () =>
			set((state) => ({
				filterOnUnPlayed: !state.filterOnUnPlayed,
			})),
		handleToggleFilterOnCompleted: () =>
			set((state) => ({ filterOnCompleted: !state.filterOnCompleted })),
		handleToggleFilterOnUnCompleted: () =>
			set((state) => ({ filterOnUnCompleted: !state.filterOnUnCompleted })),
		handleToggleFilterOnRated: () =>
			set((state) => ({ filterOnRated: !state.filterOnRated })),
		handleToggleFilterOnUnrated: () =>
			set((state) => ({ filterOnUnrated: !state.filterOnUnrated })),
		handleToggleFilterOnStarred: () =>
			set((state) => ({ filterOnStarred: !state.filterOnStarred })),
		setFilterOnStarred: (filter) => set({ filterOnStarred: filter }),
		setFilterOnRated: (filter) => set({ filterOnRated: filter }),
		setFilterOnUnRated: (filter) => set({ filterOnUnrated: filter }),
		setFilterOnPlayed: (filter) => set({ filterOnPlayed: filter }),
		setFilterOnUnPlayed: (filter) => set({ filterOnUnPlayed: filter }),
		setFilterOnCompleted: (filter) => set({ filterOnCompleted: filter }),
		setFilterOnUnCompleted: (filter) => set({ filterOnUnCompleted: filter }),
		setSelectModeOn: (selectMode) => set({ selectModeOn: selectMode }),
		handleGenreToggled: (genre) =>
			set((state) => ({
				genreFilter: state.genreFilter.includes(genre)
					? [...state.genreFilter].filter((g) => g !== genre)
					: [...state.genreFilter, genre],
			})),
		handleToggleAllGenres: (genres) =>
			set((state) => {
				if (genres.length > state.genreFilter.length) {
					return { genreFilter: genres };
				}
				return { genreFilter: [] };
			}),
		handleToggleSortName: () =>
			set((state) =>
				state.sortOption === "nameAsc"
					? { sortOption: "nameDesc" }
					: { sortOption: "nameAsc" },
			),
		handleTogglePlayerRating: () =>
			set((state) =>
				state.sortOption === "playerRatingAsc"
					? { sortOption: "playerRatingDesc" }
					: { sortOption: "playerRatingAsc" },
			),
		handleToggleSortDateAdded: () =>
			set((state) =>
				state.sortOption === "dateAddedAsc"
					? { sortOption: "dateAddedDesc" }
					: { sortOption: "dateAddedAsc" },
			),
		handleToggleSortReleaseDate: () =>
			set((state) =>
				state.sortOption === "releaseDateAsc"
					? { sortOption: "releaseDateDesc" }
					: { sortOption: "releaseDateAsc" },
			),
		handleToggleSortRating: () =>
			set((state) =>
				state.sortOption === "ratingDesc"
					? { sortOption: "ratingAsc" }
					: { sortOption: "ratingDesc" },
			),
		handleToggleSortAggRating: () =>
			set((state) =>
				state.sortOption === "aggregatedRatingAsc"
					? { sortOption: "aggregatedRatingDesc" }
					: { sortOption: "aggregatedRatingAsc" },
			),
		handleToggleSortAggRatingCount: () =>
			set((state) =>
				state.sortOption === "aggregatedRatingCountAsc"
					? { sortOption: "aggregatedRatingCountDesc" }
					: { sortOption: "aggregatedRatingCountAsc" },
			),
		handleToggleSortFollows: () =>
			set((state) =>
				state.sortOption === "followersAsc"
					? { sortOption: "followersDesc" }
					: { sortOption: "followersAsc" },
			),
		setIsTableView: (isTableView) => set({ isTableView }),
		handleToggleView: () => set((state) => ({ isTableView: !state.isTableView })),
		handleToggleHideProgress: () =>
			set((state) => ({ hideProgress: !state.hideProgress })),
	})),
);
