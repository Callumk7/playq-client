import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Dispatch } from "react";
import { CreatePlaylistForm } from "./create-playlist-form";

interface CreatePlaylistDialogProps {
  userId: string;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePlaylistDialog({
  userId,
  dialogOpen,
  setDialogOpen,
}: CreatePlaylistDialogProps) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogTitle>Create playlist</DialogTitle>
        <DialogDescription>
          Create a list that you can use to collect games that you think go together well
        </DialogDescription>
        <CreatePlaylistForm userId={userId} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}
