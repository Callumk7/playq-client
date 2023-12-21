import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, DiscIcon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useFetcher, useSubmit } from "@remix-run/react";

interface SearchEntryControlsProps {
  gameId: number;
  userId: string;
}

export function SearchEntryControls({ gameId, userId }: SearchEntryControlsProps) {
  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      <SaveToCollectionButton gameId={gameId} userId={userId} />
      <RemoveFromCollectionButton gameId={gameId} userId={userId} />
      <ReorderButtons gameId={gameId} userId={userId} />
    </div>
  );
}

function SaveToCollectionButton({ gameId, userId }: SearchEntryControlsProps) {
  const saveFetcher = useFetcher();

  return (
    <saveFetcher.Form method="post" action="/explore">
      <input type="hidden" value={gameId} name="gameId" />
      <input type="hidden" value={userId} name="userId" />
      {saveFetcher.state === "idle" ? (
        <Button variant={"ghost"} size={"icon"}>
          <DiscIcon />
        </Button>
      ) : (
        <div>working on it..</div>
      )}
    </saveFetcher.Form>
  );
}

function RemoveFromCollectionButton({ gameId, userId }: SearchEntryControlsProps) {
  const deleteFetcher = useFetcher();

  return (
    <deleteFetcher.Form method="delete" action="/api/collections">
      <input type="hidden" value={gameId} name="gameId" />
      <input type="hidden" value={userId} name="userId" />
      {deleteFetcher.state === "idle" ? (
        <Button variant={"ghost"} size={"icon"}>
          <TrashIcon />
        </Button>
      ) : (
        <div className="p-2">
          <UpdateIcon className="animate-spin" />
        </div>
      )}
    </deleteFetcher.Form>
  );
}

function ReorderButtons({ gameId, userId }: SearchEntryControlsProps) {
  return (
    <div>
      <Button variant={"ghost"} size={"icon"}>
        <ArrowUpIcon />
      </Button>
      <Button variant={"ghost"} size={"icon"}>
        <ArrowDownIcon />
      </Button>
    </div>
  );
}
