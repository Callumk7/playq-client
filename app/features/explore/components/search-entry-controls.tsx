import { RemoveFromCollectionButton } from "@/features/collection";
import { SaveToCollectionButton } from "./save-to-collection-button";

interface SearchEntryControlsProps {
  gameId: number;
  userId: string;
  isSaved: boolean;
}

export function SearchEntryControls({
  gameId,
  userId,
  isSaved,
}: SearchEntryControlsProps) {
  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      {isSaved ? (
        <RemoveFromCollectionButton gameId={gameId} userId={userId} />
      ) : (
        <SaveToCollectionButton gameId={gameId} userId={userId} />
      )}
    </div>
  );
}
