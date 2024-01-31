import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { SortOption } from "@/features/library/hooks/sort";
import { GameSortAndFilterMenu } from "@/features/library";
import { GameSearchDialog } from "./game-search-dialog";
import useFilterStore from "@/store/filters";

interface CollectionMenubarProps {
  userId: string;
  isSelecting: boolean;
  setIsSelecting: (isSelecting: boolean) => void;
}

export function CollectionMenubar({
  userId,
  isSelecting,
  setIsSelecting,
}: CollectionMenubarProps) {

  const searchTerm = useFilterStore(state => state.searchTerm);
  const setSearchTerm = useFilterStore(state => state.setSearchTerm);

  return (
    <div className="flex justify-between">
      <div className="flex w-full justify-start gap-4">
        <GameSearchDialog userId={userId} />
        <GameSortAndFilterMenu
        />
        <Button
          variant={isSelecting ? "default" : "outline"}
          onClick={() => setIsSelecting(!isSelecting)}
          className="w-40"
        >
          {isSelecting ? "Done" : "Select Games.."}
        </Button>
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
