import { SortOption } from "@/components";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PlaylistViewStore {
	genreFilter: string[];
	searchTerm: string;
	sortOption: SortOption;
	isTableView: boolean;
	filterOnPlayed: boolean;
	filterOnUnPlayed: boolean;
	filterOnCompleted: boolean;
	filterOnUnCompleted: boolean;
	filterOnRated: boolean;
	filterOnUnrated: boolean;
	filterOnStarred: boolean;
	setGenreFilter: (genreFilter: string[]) => void;
	setSearchTerm: (searchTerm: string) => void;
	setSortOption: (sortOption: SortOption) => void;
	handleToggleFilterOnPlayed: () => void;
	handleToggleFilterOnUnPlayed: () => void;
	handleToggleFilterOnCompleted: () => void;
	handleToggleFilterOnUnCompleted: () => void;
	handleToggleFilterOnRated: () => void;
	handleToggleFilterOnUnrated: () => void;
	handleToggleFilterOnStarred: () => void;
	setFilterOnStarred: (filter: boolean) => void;
	setFilterOnPlayed: (filter: boolean) => void;
	setFilterOnUnPlayed: (filter: boolean) => void;
	setFilterOnCompleted: (filter: boolean) => void;
	setFilterOnUnCompleted: (filter: boolean) => void;
	setFilterOnRated: (filter: boolean) => void;
	setFilterOnUnRated: (filter: boolean) => void;
	setIsTableView: (isTableView: boolean) => void;
	handleGenreToggled: (genre: string) => void;
	handleToggleAllGenres: (genres: string[]) => void;
	handleToggleSortName: () => void;
	handleTogglePlayerRating: () => void;
	handleToggleSortDateAdded: () => void;
	handleToggleSortReleaseDate: () => void;
	handleToggleSortAggRating: () => void;
	handleToggleSortAggRatingCount: () => void;
	handleToggleSortFollows: () => void;
	handleToggleSortRating: () => void;
	handleToggleView: () => void;

	// playlist route specific
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	isCommenting: boolean;
	setIsCommenting: (isCommenting: boolean) => void;
	renameDialogOpen: boolean;
	setRenameDialogOpen: (renameDialogOpen: boolean) => void;
	addGameDialogOpen: boolean;
	setAddGameDialogOpen: (addGameDialogOpen: boolean) => void;
}

export const usePlaylistViewStore = create<PlaylistViewStore>()(
	devtools((set) => ({
		genreFilter: [],
		searchTerm: "",
		sortOption: "ratingDesc",
		isTableView: false,
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
		isEditing: false,
		setIsEditing: (isEditing) => set({ isEditing }),
		isCommenting: false,
		setIsCommenting: (isCommenting) => set({ isCommenting }),
		renameDialogOpen: false,
		setRenameDialogOpen: (renameDialogOpen) => set({ renameDialogOpen }),
		addGameDialogOpen: false,
		setAddGameDialogOpen: (addGameDialogOpen) => set({ addGameDialogOpen }),
	})),
);
