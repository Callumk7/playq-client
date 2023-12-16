import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Form, useFetcher } from "@remix-run/react";

export function CreatePlaylistForm({ userId }: { userId: string }) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
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
