import {
	CollectionGameMenu,
	GameWithControls,
	GenreFilter,
	LibraryView,
	useFilter,
	useSearch,
	useSort,
} from "@/components";
import { CollectionTableView } from "./collection-table-view";
import { useCollectionStore } from "@/store";
import { CollectionProgress } from "./collection-progress";
import { CollectionMenubar } from "./collection-menubar";
import { useCollectionData } from "../route";

interface CollectionViewProps {
	handleOpenRateGameDialog: (gameId: number) => void;
}

export function CollectionView({
	handleOpenRateGameDialog,
}: CollectionViewProps) {
  	const { userPlaylists, games, session, genreNames } =
		useCollectionData();

  const store = useCollectionStore();

	const { filteredGames } = useFilter(games, store);
	const { searchedGames } = useSearch(filteredGames, store.searchTerm);
	const { sortedGames } = useSort(searchedGames, store.sortOption);

	// For the progress bars
	const gameCount = games.length;
	const playedGames = games.filter((game) => game.played).length;
	const completedGames = games.filter((game) => game.completed).length;

	return (
		<div>
			<div className="mb-8">
				<GenreFilter
					genres={genreNames}
					genreFilter={store.genreFilter}
					handleGenreToggled={store.handleGenreToggled}
					handleToggleAllGenres={store.handleToggleAllGenres}
				/>
			</div>
			<CollectionMenubar userId={session.user.id} userPlaylists={userPlaylists} />
			<div className="my-6">
				{!store.hideProgress && (
					<CollectionProgress
						gameCount={gameCount}
						playedGames={playedGames}
						completedGames={completedGames}
					/>
				)}
			</div>
			{store.isTableView ? (
				<CollectionTableView
					sortedGames={sortedGames}
					userPlaylists={userPlaylists}
					userId={session.user.id}
					handleOpenRateGameDialog={handleOpenRateGameDialog}
				/>
			) : (
				<LibraryView>
					{sortedGames.map((game) => (
						<GameWithControls
							key={game.id}
							coverId={game.cover.imageId}
							gameId={game.gameId}
						>
							<CollectionGameMenu
								gameId={game.gameId}
								isPlayed={game.played}
								isCompleted={game.completed ?? false}
								isPinned={game.pinned}
								userId={session.user.id}
								playlists={userPlaylists}
								gamePlaylists={game.playlists}
								handleOpenRateGameDialog={handleOpenRateGameDialog}
							/>
						</GameWithControls>
					))}
				</LibraryView>
			)}
		</div>
	);
}
