import { Button } from "@/components/ui/button";
import { DiscIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface SaveToCollectionButtonProps {
  gameId: number;
  userId: string;
}

export function SaveToCollectionButton({ gameId, userId }: SaveToCollectionButtonProps) {
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
        <div className="p-2">
          <UpdateIcon className="animate-spin" />
        </div>
      )}
    </saveFetcher.Form>
  );
}
