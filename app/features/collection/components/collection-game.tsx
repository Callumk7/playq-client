import { CollectionControls } from "./collection-controls";
import { Playlist } from "@/types/playlists";
import { CollectionContextMenu } from "./collection-context-menu";
import { GameCover } from "@/features/library";
import { GameSlideOver } from "@/features/library/components/game-slideover";
import { GameWithCollection } from "@/types/games";
import { useState } from "react";
import { RateGameDialog } from "./rate-game-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDraggable } from "@dnd-kit/core";

interface CollectionGameProps {
  game: GameWithCollection;
  gamePlaylists: Playlist[];
  userPlaylists: Playlist[];
  coverId: string;
  gameId: number;
  userId: string;
}

// TODO: Improve the imports for this component

export function CollectionGame({
  game,
  gamePlaylists,
  userPlaylists,
  coverId,
  gameId,
  userId,
}: CollectionGameProps) {
  const [isRateGameDialogOpen, setIsRateGameDialogOpen] = useState<boolean>(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: gameId,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: 0.3
      }
    : undefined;

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <div>
            <GameSlideOver game={game}>
              <CollectionContextMenu
                gameId={gameId}
                userId={userId}
                playlists={userPlaylists}
                gamePlaylists={gamePlaylists}
              >
                <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
                  <GameCover coverId={coverId} />
                </div>
              </CollectionContextMenu>
            </GameSlideOver>
            <CollectionControls
              gameId={gameId}
              isPlayed={game.played}
              userId={userId}
              playlists={userPlaylists}
              gamePlaylists={gamePlaylists}
              setIsRateGameDialogOpen={setIsRateGameDialogOpen}
              className="mt-1"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>{game.title}</TooltipContent>
      </Tooltip>
      <RateGameDialog
        userId={userId}
        gameId={gameId}
        isRateGameDialogOpen={isRateGameDialogOpen}
        setIsRateDialogOpen={setIsRateGameDialogOpen}
      />
    </>
  );
}
