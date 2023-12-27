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
import { useFetcher } from "@remix-run/react";

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
  const addToPlaylistFetcher = useFetcher();
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Add to playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {playlists.map((playlist) => (
              <ContextMenuItem
                key={playlist.id}
                onClick={() =>
                  addToPlaylistFetcher.submit(
                    {
                      gameId,
                    },
                    {
                      method: "POST",
                      action: `/api/playlists/${playlist.id}/games`,
                    },
                  )
                }
              >
                {playlist.name}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
