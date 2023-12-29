import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

interface CreatePlaylistFormProps {
  userId: string;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export function CreatePlaylistForm({ userId, dialogOpen, setDialogOpen }: CreatePlaylistFormProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  // No need to wait.. just close the dialog.
  useEffect(() => {
    if (isSubmitting && dialogOpen) {
      setDialogOpen(false);
    }
  }, [isSubmitting, dialogOpen, setDialogOpen]);

  return (
    <fetcher.Form
      method="post"
      action="/api/playlists"
      className="flex flex-row items-center space-x-3"
    >
      <Input
        type="text"
        name="playlistName"
        placeholder="Best RPGs ever.."
        disabled={isSubmitting}
      />
      <input type="hidden" name="userId" value={userId} />
      <Button variant={"outline"} size={"sm"} disabled={isSubmitting}>
        add
      </Button>
    </fetcher.Form>
  );
}
