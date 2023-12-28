import { useState } from "react";

interface WithGenres {
	genres: { genre: { name: string } }[];
}

interface WithUsers {
	users: {
		played: boolean | null;
		completed: boolean | null;
		playerRating: number | null;
	}[];
}

export const useFilter = <G extends WithGenres & WithUsers>(
	games: G[],
	genres: string[],
) => {
	let output = [...games];

	const [genreFilter, setGenreFilter] = useState<string[]>([]);
	const [filterOnPlayed, setFilterOnPlayed] = useState<boolean>(false);
	const [filterOnCompleted, setFilterOnCompleted] = useState<boolean>(false);
	const [filterOnStarred, setFilterOnStarred] = useState<boolean>(false);
	const [filterOnRated, setFilterOnRated] = useState<boolean>(false);
	const [filterOnUnrated, setFilterOnUnrated] = useState<boolean>(false);

	output = output.filter((game) => {
		if (game.genres.length === 0) {
			return true;
		}

		if (
			genreFilter.every((filterGenre) =>
				game.genres.some((gameGenre) => gameGenre.genre.name === filterGenre),
			)
		) {
			return true;
		}
	});

	if (filterOnPlayed) {
		output = output.filter((game) => game.users[0].played);
	}
	if (filterOnCompleted) {
		output = output.filter((game) => game.users[0].completed);
	}
	if (filterOnRated) {
		output = output.filter((game) => game.users[0].playerRating !== null);
	}
	if (filterOnUnrated) {
		output = output.filter((game) => game.users[0].playerRating === null);
	}

	const filteredGames = output;

	const handleGenreToggled = (genre: string) => {
		// handle genre toggled
		setGenreFilter((prevGenreFilter) =>
			prevGenreFilter.includes(genre)
				? prevGenreFilter.filter((g) => g !== genre)
				: [...prevGenreFilter, genre],
		);
	};

	const handleToggleAllGenres = () => {
		if (genres.length > genreFilter.length) {
			setGenreFilter(genres);
		} else {
			setGenreFilter([]);
		}
	};

	const handleToggleFilterOnPlayed = () => {
		setFilterOnPlayed(!filterOnPlayed);
	};
	const handleToggleFilterOnCompleted = () => {
		setFilterOnCompleted(!filterOnCompleted);
	};
	const handleToggleFilterOnStarred = () => {
		setFilterOnStarred(!filterOnStarred);
	};
	const handleToggleFilterOnRated = () => {
		setFilterOnRated(!filterOnRated);
	};
	const handleToggleFilterOnUnrated = () => {
		setFilterOnUnrated(!filterOnUnrated);
	};

	return {
		genreFilter,
		setGenreFilter,
		filteredGames,
		handleGenreToggled,
		handleToggleAllGenres,
		filterOnPlayed,
		filterOnCompleted,
		filterOnStarred,
		filterOnRated,
		filterOnUnrated,
		handleToggleFilterOnPlayed,
		handleToggleFilterOnCompleted,
		handleToggleFilterOnStarred,
		handleToggleFilterOnRated,
		handleToggleFilterOnUnrated,
	};
};
