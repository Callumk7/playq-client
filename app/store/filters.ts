import { SortOption } from "@/features/library/hooks/sort";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FilterStore {
	genreFilter: string[];
	searchTerm: string;
	sortOption: SortOption;
	filterOnPlayed: boolean;
	filterOnCompleted: boolean;
	filterOnRated: boolean;
	filterOnUnrated: boolean;
	filterOnStarred: boolean;
	setGenreFilter: (genreFilter: string[]) => void;
	setSearchTerm: (searchTerm: string) => void;
	setSortOption: (sortOption: SortOption) => void;
	handleToggleFilterOnPlayed: () => void;
	handleToggleFilterOnCompleted: () => void;
	handleToggleFilterOnRated: () => void;
	handleToggleFilterOnUnrated: () => void;
	handleToggleFilterOnStarred: () => void;
	setFilterOnStarred: (filter: boolean) => void;
	setFilterOnPlayed: (filter: boolean) => void;
	setFilterOnCompleted: (filter: boolean) => void;
	setFilterOnRated: (filter: boolean) => void;
	handleGenreToggled: (genre: string) => void;
	handleToggleAllGenres: (genres: string[]) => void;
}

const useFilterStore = create<FilterStore>()(
	devtools((set) => ({
		genreFilter: [],
		searchTerm: "",
		sortOption: "rating",
		filterOnPlayed: false,
		filterOnCompleted: false,
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
		handleToggleFilterOnCompleted: () =>
			set((state) => ({ filterOnCompleted: !state.filterOnCompleted })),
		handleToggleFilterOnRated: () =>
			set((state) => ({ filterOnRated: !state.filterOnRated })),
		handleToggleFilterOnUnrated: () =>
			set((state) => ({ filterOnUnrated: !state.filterOnUnrated })),
		handleToggleFilterOnStarred: () =>
			set((state) => ({ filterOnStarred: !state.filterOnStarred })),
		setFilterOnStarred: (filter) => set({ filterOnStarred: filter }),
		setFilterOnRated: (filter) => set({ filterOnRated: filter }),
		setFilterOnCompleted: (filter) => set({ filterOnCompleted: filter }),
		setFilterOnPlayed: (filter) => set({ filterOnPlayed: filter }),
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
				} else {
					return { genreFilter: [] };
				}
			}),
	})),
);

export default useFilterStore;
