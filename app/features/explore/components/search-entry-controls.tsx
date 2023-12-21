import { SaveToCollectionButton } from "./save-to-collection-button";
import { RemoveFromCollectionButton } from "@/features/collection/components/delete-from-collection-button";

interface SearchEntryControlsProps {
  gameId: number;
  userId: string;
}

export function SearchEntryControls({ gameId, userId }: SearchEntryControlsProps) {
  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      <SaveToCollectionButton gameId={gameId} userId={userId} />
      <RemoveFromCollectionButton gameId={gameId} userId={userId} />
    </div>
  );
}
