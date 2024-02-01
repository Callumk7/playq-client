import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carosel";
import { Container } from "@/features/layout";
import { GameCover } from "@/features/library";
import { DBImage } from "@/features/library/components/game-cover";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { games } from "db/schema/games";
import { eq } from "drizzle-orm";

///
/// LOADER
///
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const gameId = Number(params.gameId);
  const gameData = await db.query.games.findFirst({
    where: eq(games.gameId, gameId),
    with: {
      cover: true,
      screenshots: true,
      artworks: true,
      genres: {
        with: {
          genre: true,
        },
      },
    },
  });

  if (!gameData) {
    return redirect("/");
  }

  return json({ gameData });
};

export default function GamesRoute() {
  const { gameData } = useLoaderData<typeof loader>();
  return (
    <>
      <Container className="flex flex-col gap-7">
        <h1 className="text-5xl font-black">{gameData.title}</h1>
      </Container>
      <div>
        <Carousel className="w-full">
          <CarouselContent>
            {gameData.screenshots.map((screenshot) => (
              <CarouselItem key={screenshot.id}>
                <Card>
                  <DBImage imageId={screenshot.imageId} size="screenshot_big" />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {gameData.artworks.map((screenshot) => (
              <CarouselItem key={screenshot.id}>
                <Card>
                  <DBImage imageId={screenshot.imageId} size="screenshot_big" />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}
