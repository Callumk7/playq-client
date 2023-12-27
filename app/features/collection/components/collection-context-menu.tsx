import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Playlist } from "@/types/playlists";

interface CollectionContextMenuProps {
  gameId: number;
  userId: string;
  playlists: Playlist[];
  children: React.ReactNode;
}

export function CollectionContextMenu({
  gameId,
  userId,
  playlists,
  children,
}: CollectionContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Add to playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {playlists.map((playlist) => (
              <ContextMenuItem key={playlist.id}>{playlist.name}</ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
