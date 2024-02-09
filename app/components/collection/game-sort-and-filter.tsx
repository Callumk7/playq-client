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
import { useFilterStore } from "@/store/filters";

export function GameSortAndFilterMenu() {
  const store = useFilterStore();

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Sort</MenubarTrigger>
        <MenubarContent className="w-64">
          <MenubarRadioGroup value={store.sortOption}>
            <MenubarRadioItem
              value="rating"
              onClick={() => store.setSortOption("rating")}
            >
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
                store.sortOption === "releaseDateAsc"
                  ? "releaseDateAsc"
                  : "releaseDateDesc"
              }
              onClick={
                store.sortOption === "releaseDateAsc"
                  ? () => store.setSortOption("releaseDateDesc")
                  : () => store.setSortOption("releaseDateAsc")
              }
            >
              <span>Release Date</span>
              {store.sortOption === "releaseDateAsc" ? (
                <ArrowDownIcon />
              ) : (
                <ArrowUpIcon />
              )}
            </MenubarRadioItem>
            <MenubarRadioItem
              className="flex justify-between"
              value={
                store.sortOption === "dateAddedAsc" ? "dateAddedAsc" : "dateAddedDesc"
              }
              onClick={
                store.sortOption === "dateAddedAsc"
                  ? () => store.setSortOption("dateAddedDesc")
                  : () => store.setSortOption("dateAddedAsc")
              }
            >
              <span>Date Added To Collection</span>
              {store.sortOption === "releaseDateAsc" ? (
                <ArrowDownIcon />
              ) : (
                <ArrowUpIcon />
              )}
            </MenubarRadioItem>
            <MenubarRadioItem
              className="flex justify-between"
              value={
                store.sortOption === "playerRatingAsc"
                  ? "playerRatingAsc"
                  : "playerRatingDesc"
              }
              onClick={
                store.sortOption === "playerRatingAsc"
                  ? () => store.setSortOption("playerRatingDesc")
                  : () => store.setSortOption("playerRatingAsc")
              }
            >
              <span>Your Rating</span>
              {store.sortOption === "playerRatingAsc" ? (
                <ArrowDownIcon />
              ) : (
                <ArrowUpIcon />
              )}
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
            checked={store.filterOnUnCompleted}
              onClick={store.handleToggleFilterOnUnCompleted}
          >
            Not Completed
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={store.filterOnPlayed}
            onClick={store.handleToggleFilterOnPlayed}
          >
            Played
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={store.filterOnUnPlayed}
            onClick={store.handleToggleFilterOnUnPlayed}
          >
            Not Played
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={store.filterOnRated}
            onClick={store.handleToggleFilterOnRated}
          >
            Rated
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={store.filterOnUnrated}
            onClick={store.handleToggleFilterOnUnrated}
          >
            Not Rated
          </MenubarCheckboxItem>
          {(store.filterOnPlayed ||
            store.filterOnUnPlayed ||
            store.filterOnStarred ||
            store.filterOnRated ||
            store.filterOnUnCompleted ||
            store.filterOnCompleted || store.genreFilter.length > 0) && (
            <MenubarItem
              inset
              className="font-bold text-destructive"
              onClick={() => {
                store.setGenreFilter([]);
                store.setFilterOnPlayed(false);
                store.setFilterOnUnPlayed(false);
                store.setFilterOnRated(false);
                store.setFilterOnCompleted(false);
                store.setFilterOnUnCompleted(false);
              }}
            >
              Clear Filters
            </MenubarItem>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
