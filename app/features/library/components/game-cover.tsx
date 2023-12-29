import { IGDBImage } from "@/types/igdb";
import { cn } from "@/util/cn";

interface GameCoverProps {
  coverId: string;
  isSelected?: boolean;
}

export function GameCover({
  coverId,
  isSelected,
}: GameCoverProps) {
  const size: IGDBImage = "720p";

  const getBorderStyle = (isSelected: boolean) =>
    isSelected
      ? "border border-lime-500/40 hover:border-lime-500 shadow-lg shadow-lime-500/20 hover:shadow-lime-500/40"
      : "border hover:border-foreground";

  const borderStyle = getBorderStyle(isSelected || false);

  return (
    <div
      className={cn(
        borderStyle,
        "relative flex max-w-sm flex-col items-center justify-between overflow-hidden rounded-lg text-foreground",
      )}
    >
      <DBImage imageId={coverId} size={size} />
    </div>
  );
}

export function DBImage({ imageId, size }: { imageId: string, size: IGDBImage }) {
  return (
    <img
      src={`https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`}
      alt="cover image"
    />
  );
}

