import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FilterStore {
	genreFilter: string[];
	searchTerm: string;
	filterOnPlayed: boolean;
	filterOnCompleted: boolean;
	filterOnRated: boolean;
	filterOnUnrated: boolean;
	filterOnStarred: boolean;
	setGenreFilter: (genreFilter: string[]) => void;
	setSearchTerm: (searchTerm: string) => void;
	handleToggleFilterOnPlayed: () => void;
	handleToggleFilterOnCompleted: () => void;
	handleToggleFilterOnRated: () => void;
	handleToggleFilterOnUnrated: () => void;
	handleToggleFilterOnStarred: () => void;
}

const useFilterStore = create<FilterStore>()(
	devtools((set) => ({
		genreFilter: [],
		searchTerm: "",
		filterOnPlayed: false,
		filterOnCompleted: false,
		filterOnRated: false,
		filterOnUnrated: false,
		filterOnStarred: false,
		setGenreFilter: (genreFilter) => set({ genreFilter }),
		setSearchTerm: (searchTerm) => set({ searchTerm }),
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
	})),
);

export default useFilterStore;
