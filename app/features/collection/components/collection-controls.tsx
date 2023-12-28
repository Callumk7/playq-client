import { RemoveFromCollectionButton } from "./remove-from-collection-button";
import { ReorderButtons } from "./reorder-buttons";

interface CollectionControlsProps {
  gameId: number;
  userId: string;
  moveGame: (gameId: number, direction: 1 | -1) => void;
}

export function CollectionControls({ gameId, userId, moveGame }: CollectionControlsProps) {
  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      <RemoveFromCollectionButton gameId={gameId} userId={userId} />
      <ReorderButtons gameId={gameId} userId={userId} moveGame={moveGame} />
      {/*       <GameMenuButton gameId={gameId} userId={userId} /> */}
    </div>
  );
}
