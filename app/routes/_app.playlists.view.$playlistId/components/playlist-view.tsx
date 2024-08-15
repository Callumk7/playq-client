import { GameCover, LibraryView } from "@/components";
import { PlaylistEntryControls } from "./playlist-entry-controls";
import { usePlaylistViewData } from "../route";

export function PlaylistView({ isEditing }: { isEditing: boolean }) {
	const data = usePlaylistViewData();
	const { playlistWithGames, userCollection, session } = data;
	const userCollectionGameIds = userCollection.map((c) => c.gameId);

	return (
		<LibraryView>
			{playlistWithGames!.games.map((game) => (
				<div key={game.game.id} className="flex flex-col gap-2">
					<GameCover coverId={game.game.cover.imageId} gameId={game.gameId} />
					<PlaylistEntryControls
						inCollection={userCollectionGameIds.includes(game.gameId)}
						gameId={game.gameId}
						userId={session.user.id}
						isEditing={isEditing}
					/>
				</div>
			))}
		</LibraryView>
	);
}
