import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";

export function CollectionMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Sort</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Alphabetical</MenubarItem>
          <MenubarItem>Recently Played</MenubarItem>
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
  );
}
