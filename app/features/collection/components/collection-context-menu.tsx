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
import { InsertGameToPlaylist } from "@/types/api";
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
              <PlaylistSubMenuItem
                key={playlist.id}
                playlist={playlist}
                gameId={gameId}
                gamePlaylists={gamePlaylists}
              />
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

interface PlaylistSubMenuItemProps {
  playlist: Playlist;
  gameId: number;
  gamePlaylists?: Playlist[];
}

function PlaylistSubMenuItem({
  playlist,
  gameId,
  gamePlaylists,
}: PlaylistSubMenuItemProps) {
  const session = useSession();
  const addToPlaylistFetcher = useFetcher();
  const gameInsert: InsertGameToPlaylist = {
    gameId,
    addedBy: ,
  }
  return (
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
  );
}
