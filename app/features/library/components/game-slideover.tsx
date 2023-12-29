import {
  SlideOver,
  SlideOverContent,
  SlideOverDescription,
  SlideOverHeader,
  SlideOverTitle,
  SlideOverTrigger,
} from "@/components/ui/custom/slide-over";
import { GameWithCollection } from "@/types/games";

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
      </SlideOverContent>
    </SlideOver>
  );
}
