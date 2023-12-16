import { Button } from "@/components/ui/button";
import { DiscIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";

interface SearchEntryControlsProps {
  gameId: number;
}

export function SearchEntryControls({ gameId }: SearchEntryControlsProps) {
  // I used this api in the first version and I am not sure I fully understand its
  // value, compared to either a form or just a fetch request
  const submit = useSubmit();
  const handleSaveToLibrary = () => {
    submit(
      {
        gameId,
      },
      {
        method: "post",
        action: "/library",
      },
    );
  };
  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      <Button variant={"ghost"} size={"icon"} onClick={handleSaveToLibrary}>
        <DiscIcon />
      </Button>
    </div>
  );
}
