import { useState } from "react";

interface HasTitle {
	title: string;
}

export const useSearch = <G extends HasTitle>(games: G[]) => {
	const [searchTerm, setSearchTerm] = useState<string>("");

	let output: G[] = [...games];
	if (searchTerm !== "") {
		output = output.filter((game) =>
			game.title.toLowerCase().includes(searchTerm.toLowerCase()),
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
