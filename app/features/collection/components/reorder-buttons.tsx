import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

interface ReorderButtonsProps {
  gameId: number;
  userId: string;
  moveGame: (gameId: number, direction: 1 | -1) => void;
}

export function ReorderButtons({ gameId, userId, moveGame }: ReorderButtonsProps) {
  return (
    <div>
      <Button variant={"ghost"} size={"icon"} onClick={() => moveGame(gameId, -1)}>
        <ArrowUpIcon />
      </Button>
      <Button variant={"ghost"} size={"icon"} onClick={() => moveGame(gameId, 1)}>
        <ArrowDownIcon />
      </Button>
    </div>
  );
}
