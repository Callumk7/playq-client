import { IGDBImage } from "@/types/igdb";
import { cn } from "@/util/cn";
import { CollectionContextMenu } from "../collection/components/collection-context-menu";

interface GameCoverProps {
  coverId: string;
  isSelected?: boolean;
  children?: React.ReactNode;
}

export function GameCover({
  coverId,
  isSelected,
  children,
}: GameCoverProps) {
  const size: IGDBImage = "720p";

  const getBorderStyle = (isSelected: boolean) => isSelected 
    ? "border border-lime-500/40 hover:border-lime-500 shadow-lg shadow-lime-500/20 hover:shadow-lime-500/40"
    : "border hover:border-foreground";

  const borderStyle = getBorderStyle(isSelected || false);

  return (
    <div>
      <div
        className={cn(
          borderStyle,
          "relative flex max-w-sm flex-col items-center justify-between overflow-hidden rounded-lg text-foreground",
        )}
      >
        <CollectionContextMenu gameId={123} userId="string">
          <img
            src={`https://images.igdb.com/igdb/image/upload/t_${size}/${coverId}.jpg`}
            alt="cover image"
            width={720}
            height={1280}
          />
        </CollectionContextMenu>
      </div>
      <div className="pt-3">{children}</div>
    </div>
  );
}
