import {
  GameSortAndFilterMenu,
  Input,
  ExternalSearchDialog,
} from "@/components";
import { useCollectionStore } from "@/store/collection";
import { Playlist } from "@/types";

interface CollectionMenubarProps {
  userId: string;
  userPlaylists: Playlist[];
}

export function CollectionMenubar({
  userId,
  userPlaylists,
}: CollectionMenubarProps) {
  const searchTerm = useCollectionStore((state) => state.searchTerm);
  const setSearchTerm = useCollectionStore((state) => state.setSearchTerm);

  return (
    <div className="flex justify-between">
      <div className="flex gap-4 justify-start w-full">
        <ExternalSearchDialog userId={userId} />
        <GameSortAndFilterMenu userId={userId} userPlaylists={userPlaylists} />
      </div>
      <Input
        name="search"
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        placeholder="Search your collection"
      />
    </div>
  );
}
