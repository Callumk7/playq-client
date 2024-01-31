import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { ChangeEvent } from "react";
import { SortOption } from "@/features/library/hooks/sort";
import { GameSortAndFilterMenu } from "@/features/library";
import { GameSearchDialog } from "./game-search-dialog";

interface CollectionMenubarProps {
  userId: string;
  searchTerm: string;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  handleSearchTermChanged: (e: ChangeEvent<HTMLInputElement>) => void;
  isSelecting: boolean;
  setIsSelecting: (isSelecting: boolean) => void;
}

export function CollectionMenubar({
  userId,
  searchTerm,
  sortOption,
  setSortOption,
  handleSearchTermChanged,
  isSelecting,
  setIsSelecting,
}: CollectionMenubarProps) {
  return (
    <div className="flex justify-between">
      <div className="flex w-full justify-start gap-4">
        <GameSearchDialog userId={userId} />
        <GameSortAndFilterMenu
          sortOption={sortOption}
          setSortOption={setSortOption}
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
        onChange={handleSearchTermChanged}
        placeholder="Search your collection"
      />
    </div>
  );
}
