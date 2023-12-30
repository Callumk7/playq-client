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
        {game.artworks[0] && (
          <DBImage imageId={game.artworks[0].imageId} size="1080p" className="absolute left-0 right-0 aspect-auto"/>
        )}
        <ScrollArea className="h-full w-full">
          <div className="grid grid-cols-2 gap-4"></div>
        </ScrollArea>
      </SlideOverContent>
    </SlideOver>
  );
}
