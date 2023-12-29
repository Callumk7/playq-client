import {
  SlideOver,
  SlideOverContent,
  SlideOverDescription,
  SlideOverHeader,
  SlideOverTitle,
  SlideOverTrigger,
} from "@/components/ui/custom/slide-over";
import { GameWithCollection } from "@/types/games";
import { DBImage } from "./game-cover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GameSlideOverProps {
  game: GameWithCollection;
  children: React.ReactNode;
}
export function GameSlideOver({ game, children }: GameSlideOverProps) {
  return (
    <SlideOver>
      <SlideOverTrigger>{children}</SlideOverTrigger>
      <SlideOverContent>
        <SlideOverHeader>
          <SlideOverTitle>{game.title}</SlideOverTitle>
          {game.storyline && (
            <SlideOverDescription className="whitespace-pre-wrap">
              {game.storyline}
            </SlideOverDescription>
          )}
        </SlideOverHeader>
        <ScrollArea className="w-full h-full">
          <div className="grid grid-cols-2 gap-4">
            {game.artworks?.map((artwork) => (
              <DBImage key={artwork.id} imageId={artwork.imageId} size="1080p" />
            ))}
          </div>
        </ScrollArea>
      </SlideOverContent>
    </SlideOver>
  );
}
