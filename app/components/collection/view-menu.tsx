import {
  GameSortAndFilterMenu,
  Input,
  Toggle,
} from "@/components";
import { useCollectionStore } from "@/store/collection";
import { TableIcon } from "@radix-ui/react-icons";

interface CollectionMenubarProps {
  userId: string;
  isTableView: boolean;
  setIsTableView: (isTableView: boolean) => void;
}

export function CollectionMenubar({
  userId,
  isTableView,
  setIsTableView,
}: CollectionMenubarProps) {
  const searchTerm = useCollectionStore((state) => state.searchTerm);
  const setSearchTerm = useCollectionStore((state) => state.setSearchTerm);

  return (
    <div className="flex justify-between">
      <div className="flex gap-4 justify-start w-full">
        <GameSortAndFilterMenu />
        <Toggle
          variant={"outline"}
          pressed={isTableView}
          onPressedChange={() => setIsTableView(!isTableView)}
        >
          <TableIcon />
        </Toggle>
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
