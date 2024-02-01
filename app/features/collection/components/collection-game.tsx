import { CollectionControls } from "./collection-controls";
import { Playlist } from "@/types/playlists";
import { GameCover } from "@/features/library";
import { GameWithCollection } from "@/types/games";
import { useState } from "react";
import { RateGameDialog } from "./rate-game-dialog";
import { useDraggable } from "@dnd-kit/core";

interface CollectionGameProps {
  game: GameWithCollection;
  gamePlaylists: Playlist[];
  userPlaylists: Playlist[];
  coverId: string;
  gameId: number;
  userId: string;
}

export function CollectionGame({
  game,
  gamePlaylists,
  userPlaylists,
  coverId,
  gameId,
  userId,
}: CollectionGameProps) {
  const [isRateGameDialogOpen, setIsRateGameDialogOpen] = useState<boolean>(false);

  // Dragging stuff
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: gameId,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(0.5)`,
        opacity: 0.3,
      }
    : undefined;

  return (
    <>
      <div>
        <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
          <GameCover coverId={coverId} gameId={gameId} />
        </div>

        <div className="mt-1 flex w-full justify-between">
          <CollectionControls
            gameId={gameId}
            isPlayed={game.played}
            isCompleted={game.completed ?? false}
            userId={userId}
            playlists={userPlaylists}
            gamePlaylists={gamePlaylists}
            setIsRateGameDialogOpen={setIsRateGameDialogOpen}
          />
        </div>
      </div>

      {/* I am still not sure this is how you are supposed to work
      with dialogs, but for now it works ok*/}
      <RateGameDialog
        userId={userId}
        gameId={gameId}
        isRateGameDialogOpen={isRateGameDialogOpen}
        setIsRateDialogOpen={setIsRateGameDialogOpen}
      />
    </>
  );
}
