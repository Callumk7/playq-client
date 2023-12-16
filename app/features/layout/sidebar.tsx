import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreatePlaylistDialog } from "../playlists/components/create-playlist-dialog";

export function Sidebar({ userId }: { userId: string }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <div className="h-full w-full rounded-md border p-3">
      <Button
        onClick={() => setDialogOpen(true)}
        className="mx-4 my-6"
        variant={"secondary"}
      >
        <span className="mr-1">Add Playlist</span>
      </Button>
      <CreatePlaylistDialog
        userId={userId}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </div>
  );
}
