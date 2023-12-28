import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { GameSearch } from "./game-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { ChangeEvent } from "react";

interface CollectionMenubarProps {
  userId: string;
  searchTerm: string;
  handleSearchTermChanged: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function CollectionMenubar({
  userId,
  searchTerm,
  handleSearchTermChanged
}: CollectionMenubarProps) {
  return (
    <div className="flex justify-between">
      <div className="flex w-full justify-start gap-4">
        <GameSearch userId={userId} />
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Sort</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Alphabetical</MenubarItem>
              <MenubarItem>Recently Added</MenubarItem>
              <MenubarItem>Recently Played</MenubarItem>
              <MenubarItem>Recently Completed</MenubarItem>
              <MenubarItem>Recently Followed</MenubarItem>
              <MenubarItem>Rating</MenubarItem>
              <MenubarItem>Aggregate Rating</MenubarItem>
              <MenubarItem>My Rating</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Filters</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Completed</MenubarItem>
              <MenubarItem>Playing</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        {/* TODO: Add a cool effect for selecting games.. */}
        <Button variant={"outline"}>Select..</Button>
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
