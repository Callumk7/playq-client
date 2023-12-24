import { RemoveFromCollectionButton } from "./delete-from-collection-button";
import { ReorderButtons } from "./reorder-buttons";

interface CollectionControlsProps {
  gameId: number;
  userId: string;
  index: number;
}

export function CollectionControls({ gameId, userId, index }: CollectionControlsProps) {
  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      <RemoveFromCollectionButton gameId={gameId} userId={userId} />
      <ReorderButtons gameId={gameId} userId={userId} />
    </div>
  );
}

