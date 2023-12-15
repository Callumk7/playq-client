import { GameCover } from "@/types/game/game";
import { IGDBImage } from "@/types/igdb/reponses";
import clsx from "clsx";

interface GameCardProps {
  game: GameCover;
  isSelected?: boolean;
  children?: React.ReactNode;
}

export function GameCard({
  game,
  isSelected,
  children,
}: GameCardProps) {
  const size: IGDBImage = "720p";

  let borderStyle = "border hover:border-foreground";
  if (isSelected) {
    borderStyle =
      "border border-lime-500/40 hover:border-lime-500 shadow-lg shadow-lime-500/20 hover:shadow-lime-500/40";
  }

  return (
    <div className="max-w-max">
      <div
        className={clsx(
          borderStyle,
          "relative flex max-w-sm flex-col items-center justify-between overflow-hidden rounded-lg text-foreground",
        )}
      >
        <img
          className="animate-in"
          src={`https://images.igdb.com/igdb/image/upload/t_${size}/${game.cover.image_id}.jpg`}
          alt="cover image"
          width={720}
          height={1280}
        />
      </div>
      <div className="max-w-[720px] pt-3 animate-in">{children}</div>
    </div>
  );
}
