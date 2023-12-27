import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

interface CollectionContextMenuProps {
  gameId: number;
  userId: string;
  children: React.ReactNode;
}

export function CollectionContextMenu({ gameId, userId, children }: CollectionContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Item 1</ContextMenuItem>
        <ContextMenuItem>Item 2</ContextMenuItem>
        <ContextMenuItem>Item 3</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
