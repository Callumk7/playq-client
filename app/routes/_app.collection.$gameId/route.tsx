import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DBImage } from "@/features/library/components/game-cover";
import { GenreTags } from "@/features/library/components/genre-filter";
import { getCompleteGame } from "@/model/games";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

///
/// LOADER
///
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const gameId = Number(params.gameId);
  const game = await getCompleteGame(gameId);

  if (!game) {
    return redirect("/");
  }

  return json({ game });
};

export default function GamesRoute() {
  const { game } = useLoaderData<typeof loader>();
  return (
    <main className="mt-10">
      <DBImage imageId={game.artworks[0].imageId} size="1080p" className="rounded-2xl" />
      <div className="flex flex-col gap-5">
        <h1 className="text-6xl font-semibold py-4">{game.title}</h1>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <GenreTags genres={game.genres.map(g => g.genre.name)} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Storyline</CardTitle>
              <CardContent>
                <div>{game.storyline}</div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-4">
          {game.screenshots.map(screenshot => (
            <DBImage key={screenshot.id} imageId={screenshot.imageId} size="720p" className="aspect-auto max-w-80" />
          ))}
        </div>
      </div>
    </main>
  );
}
