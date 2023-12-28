import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Playlist } from "@/types/playlists";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface CollectionContextMenuProps {
  gameId: number;
  playlists: Playlist[];
  gamePlaylists?: Playlist[];
  children: React.ReactNode;
}

export function CollectionContextMenu({
  gameId,
  playlists,
  gamePlaylists,
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
              <ContextMenuCheckboxItem
                key={playlist.id}
                checked={gamePlaylists?.some((p) => p.id === playlist.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    addToPlaylistFetcher.submit(
                      {
                        gameId,
                      },
                      {
                        method: "POST",
                        action: `/api/playlists/${playlist.id}/games`,
                      },
                    );
                  } else {
                    addToPlaylistFetcher.submit(
                      {
                        gameId,
                      },
                      {
                        method: "DELETE",
                        action: `/api/playlists/${playlist.id}/games`,
                      },
                    );
                 }
                }}
              >
                {playlist.name}
              </ContextMenuCheckboxItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
