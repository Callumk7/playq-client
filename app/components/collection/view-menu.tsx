import { GameSortAndFilterMenu, Input, ExternalSearchDialog } from "@/components";
import { useFilterStore } from "@/store/filters";

interface CollectionMenubarProps {
  userId: string;
}

export function CollectionMenubar({ userId }: CollectionMenubarProps) {
  const searchTerm = useFilterStore((state) => state.searchTerm);
  const setSearchTerm = useFilterStore((state) => state.setSearchTerm);

  return (
    <div className="flex justify-between">
      <div className="flex w-full justify-start gap-4">
        <ExternalSearchDialog userId={userId} />
        <GameSortAndFilterMenu />
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
