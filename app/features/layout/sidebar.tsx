import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreatePlaylistDialog } from "../playlists/components/create-playlist-dialog";
import { Playlist } from "db/schema/playlists";

interface SidebarProps {
  userId: string;
  playlists: Playlist[];
}

export function Sidebar({ userId, playlists }: SidebarProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="h-full w-full rounded-md border p-3">
        <Button
          onClick={() => setDialogOpen(true)}
          className="mx-4 my-6"
          variant={"secondary"}
        >
          <span className="mr-1">Add Playlist</span>
        </Button>
        <div className="flex flex-col gap-2">
          {playlists.map((playlist) => (
            <SidebarPlaylistEntry key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>

      <CreatePlaylistDialog
        userId={userId}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}

interface SidebarPlaylistEntryProps {
  playlist: Playlist;
}

function SidebarPlaylistEntry({ playlist }: SidebarPlaylistEntryProps) {
  return (
    <div className="p-4 rounded-md hover:bg-background-hover">
      <span className="font-bold">{playlist.name}</span>
    </div>
  )
}
