import { CollectionControls } from "./collection-controls";
import { Playlist } from "@/types/playlists";
import { CollectionContextMenu } from "./collection-context-menu";
import { GameCover } from "@/features/library";

interface CollectionGameProps {
  gamePlaylists: Playlist[];
  userPlaylists: Playlist[];
  coverId: string;
  gameId: number;
  userId: string;
  moveGame: (gameId: number, direction: 1 | -1) => void;
}

export function CollectionGame({
  gamePlaylists,
  userPlaylists,
  coverId,
  gameId,
  userId,
  moveGame,
}: CollectionGameProps) {

  return (
    <CollectionContextMenu
      gameId={gameId}
      userId={userId}
      playlists={userPlaylists}
      gamePlaylists={gamePlaylists}
    >
      <GameCover coverId={coverId} gameId={gameId} playlists={userPlaylists}>
        <CollectionControls gameId={gameId} userId={userId} moveGame={moveGame} />
      </GameCover>
    </CollectionContextMenu>
  );
}
