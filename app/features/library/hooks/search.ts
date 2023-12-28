import { useState } from "react";

interface GameHasTitle {
	game: {
		title: string;
	};
}

export const useSearch = <G extends GameHasTitle>(games: G[]) => {
	const [searchTerm, setSearchTerm] = useState<string>("");

	let output: G[] = [...games];
	if (searchTerm !== "") {
		output = output.filter((game) =>
			game.game.title.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}

	const searchedGames = output;

	const handleSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	return {
		searchTerm,
		setSearchTerm,
		searchedGames,
		handleSearchTermChanged,
	};
};
