import { GameCover } from "@/features/library/game-cover";
import { CollectionControls } from "./collection-controls";
import { Playlist } from "@/types/playlists";
import { CollectionContextMenu } from "./collection-context-menu";

interface CollectionGameProps {
  gamePlaylists: Playlist[];
  userPlaylists: Playlist[];
  coverId: string;
  gameId: number;
  userId: string;
}

export function CollectionGame({
  gamePlaylists,
  userPlaylists,
  coverId,
  gameId,
  userId,
}: CollectionGameProps) {
  return (
    <CollectionContextMenu gameId={gameId} playlists={userPlaylists} gamePlaylists={gamePlaylists}>
      <GameCover coverId={coverId} gameId={gameId} playlists={userPlaylists}>
        <CollectionControls gameId={gameId} userId={userId} />
      </GameCover>
    </CollectionContextMenu>
  );
}
