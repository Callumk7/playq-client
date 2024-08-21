import { SortOption } from "@/components";

export interface SortState {
	sortOption: SortOption;
	setSortOption: (sortOption: SortOption) => void;
	handleToggleSortDateAdded: () => void;
	handleToggleSortReleaseDate: () => void;
	handleToggleSortAggRating: () => void;
	handleToggleSortAggRatingCount: () => void;
	handleToggleSortFollows: () => void;
	handleToggleSortRating: () => void;
	handleToggleSortName: () => void;
	handleTogglePlayerRating: () => void;
}

export interface FilterState {
	genreFilter: string[];
	setGenreFilter: (genreFilter: string[]) => void;
	handleGenreToggled: (genre: string) => void;
	handleToggleAllGenres: (genres: string[]) => void;
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
	filterOnPlayed: boolean;
	setFilterOnPlayed: (filter: boolean) => void;
	handleToggleFilterOnPlayed: () => void;
	filterOnUnPlayed: boolean;
	setFilterOnUnPlayed: (filter: boolean) => void;
	handleToggleFilterOnUnPlayed: () => void;
	filterOnCompleted: boolean;
	setFilterOnCompleted: (filter: boolean) => void;
	handleToggleFilterOnCompleted: () => void;
	filterOnUnCompleted: boolean;
	setFilterOnUnCompleted: (filter: boolean) => void;
	handleToggleFilterOnUnCompleted: () => void;
	filterOnRated: boolean;
	setFilterOnRated: (filter: boolean) => void;
	handleToggleFilterOnRated: () => void;
	filterOnUnrated: boolean;
	setFilterOnUnRated: (filter: boolean) => void;
	handleToggleFilterOnUnrated: () => void;
	filterOnStarred: boolean;
	setFilterOnStarred: (filter: boolean) => void;
	handleToggleFilterOnStarred: () => void;
}

export interface ViewState {
	isTableView: boolean;
	setIsTableView: (isTableView: boolean) => void;
	handleToggleView: () => void;
}
