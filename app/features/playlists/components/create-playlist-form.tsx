import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Form, useNavigation } from "@remix-run/react";

export function CreatePlaylistForm({ userId }: { userId: string }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/playlists";
  return (
    <Form
      method="post"
      action="/playlists"
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
    </Form>
  );
}
