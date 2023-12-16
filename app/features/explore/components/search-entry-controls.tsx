import { Button } from "@/components/ui/button";
import { DiscIcon } from "@radix-ui/react-icons";
import { useFetcher, useSubmit } from "@remix-run/react";

interface SearchEntryControlsProps {
  gameId: number;
  userId: string;
}

export function SearchEntryControls({ gameId, userId }: SearchEntryControlsProps) {
  // I used this api in the first version and I am not sure I fully understand its
  // value, compared to either a form or just a fetch request
  const fetcher = useFetcher();
  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      <fetcher.Form method="post" action="/explore">
        <input type="hidden" value={gameId} name="gameId" />
        <input type="hidden" value={userId} name="userId" />
        {fetcher.state === "idle" ? (
          <Button variant={"ghost"} size={"icon"}>
            <DiscIcon />
          </Button>
        ) : (
          <div>working on it..</div>
        )}
      </fetcher.Form>
    </div>
  );
}
