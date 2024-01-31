import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import useFilterStore from "@/store/filters";

export function GameSortAndFilterMenu() {

  const store = useFilterStore();

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Sort</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={store.sortOption}>
            <MenubarRadioItem value="rating" onClick={() => store.setSortOption("rating")}>
              Rating
            </MenubarRadioItem>
            <MenubarRadioItem
              className="flex justify-between"
              value={store.sortOption === "nameAsc" ? "nameAsc" : "nameDesc"}
              onClick={
                store.sortOption === "nameAsc"
                  ? () => store.setSortOption("nameDesc")
                  : () => store.setSortOption("nameAsc")
              }
            >
              <span>Alphabetical</span>
              {store.sortOption === "nameAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </MenubarRadioItem>
            <MenubarRadioItem
              className="flex justify-between"
              value={
                store.sortOption === "releaseDateAsc" ? "releaseDateAsc" : "releaseDateDesc"
              }
              onClick={
                store.sortOption === "releaseDateAsc"
                  ? () => store.setSortOption("releaseDateDesc")
                  : () => store.setSortOption("releaseDateAsc")
              }
            >
              <span>Release Date</span>
              {store.sortOption === "releaseDateAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </MenubarRadioItem>
            <MenubarRadioItem
              value="dateAdded"
              onClick={() => store.setSortOption("dateAdded")}
            >
              Date Added
            </MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Filters</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem
            checked={store.filterOnCompleted}
            onClick={store.handleToggleFilterOnCompleted}
          >
            Completed
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={store.filterOnPlayed}
            onClick={store.handleToggleFilterOnPlayed}
          >
            Played
          </MenubarCheckboxItem>
          <MenubarItem inset>Starred</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
