import { cn } from "@/util/cn";
import { GameMenuButton } from "..";
import { Playlist } from "@/types/playlists";

interface CollectionControlsProps {
  gameId: number;
  isPlayed: boolean;
  isCompleted: boolean;
  userId: string;
  className?: string;
  playlists: Playlist[];
  gamePlaylists?: Playlist[];
  setIsRateGameDialogOpen: (isDialogOpen: boolean) => void;
}

export function CollectionControls({
  gameId,
  isPlayed,
  isCompleted,
  userId,
  className,
  playlists,
  gamePlaylists,
  setIsRateGameDialogOpen,
}: CollectionControlsProps) {
  return (
    <div
      className={cn(
        className,
        "flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1",
      )}
    >
      <GameMenuButton
        gameId={gameId}
        isPlayed={isPlayed}
        isCompleted={isCompleted}
        userId={userId}
        playlists={playlists}
        gamePlaylists={gamePlaylists}
        setIsRateGameDialogOpen={setIsRateGameDialogOpen}
      />
    </div>
  );
}
