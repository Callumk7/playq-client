import {
	LibraryView,
} from "@/components";
import { ExploreGame } from "@/features/explore/components/search-game";
import { GameListItem } from "@/features/library/components/game-list-item";
import { ListView } from "@/features/library/components/list-view";
import { View, useGameSearchData } from "../route";

interface ResultsViewProps {
  view: View
  userId: string
}
export function ResultsView({view, userId}: ResultsViewProps) {
  const {searchResults} = useGameSearchData();
	return (
		<>
			{view === "card" ? (
				<LibraryView>
					{searchResults.map((game) => (
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
					{searchResults.map((game) => (
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
