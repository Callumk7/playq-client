import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { GameSearch } from "./game-search";

interface CollectionMenubarProps {
  userId: string;
}

export function CollectionMenubar({ userId }: CollectionMenubarProps) {
  return (
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
    </div>
  );
}
