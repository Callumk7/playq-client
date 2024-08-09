import { LibraryView } from "@/components";
import { ExploreGame } from "@/features/explore/components/search-game";
import { GameListItem } from "@/features/library/components/game-list-item";
import { ListView } from "@/features/library/components/list-view";
import { View, useGameSearchData } from "../route";

interface ResultsViewProps {
	view: View;
	userId: string;
}
export function ResultsView({ view, userId }: ResultsViewProps) {
	const { results } = useGameSearchData();
	return (
		<>
			{view === "card" ? (
				<LibraryView>
					{results.map((game) => (
						<ExploreGame
							key={game.id}
							game={game}
							coverId={game.cover.image_id}
							gameId={game.id}
							userId={userId}
						/>
					))}
				</LibraryView>
			) : (
				<ListView>
					{results.map((game) => (
						<GameListItem
							key={game.id}
							gameTitle={game.name}
							gameId={game.id}
							userId={userId}
							game={game}
						/>
					))}
				</ListView>
			)}
		</>
	);
}
