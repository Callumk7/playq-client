import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carosel";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/features/layout";
import { GameCover } from "@/features/library";
import { DBImage } from "@/features/library/components/game-cover";
import { GenreTags } from "@/features/library/components/genre-filter";
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
    <main className="mt-10">
      <DBImage imageId={gameData.artworks[0].imageId} size="1080p" className="rounded-2xl" />
      <div className="flex flex-col gap-5">
        <h1 className="text-6xl font-semibold py-4">{gameData.title}</h1>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <GenreTags genres={gameData.genres.map(g => g.genre.name)} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Storyline</CardTitle>
              <CardContent>
                <div>{gameData.storyline}</div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-4">
          {gameData.screenshots.map(screenshot => (
            <DBImage key={screenshot.id} imageId={screenshot.imageId} size="720p" className="aspect-auto max-w-80" />
          ))}
        </div>
      </div>
    </main>
  );
}
