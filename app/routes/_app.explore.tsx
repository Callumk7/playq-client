import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { IGDB_BASE_URL, WORKER_URL } from "@/constants";
import { auth } from "@/features/auth/helper";
import { SearchEntryControls } from "@/features/explore/components/search-entry-controls";
import { GameCard } from "@/features/library/game-card";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { GameCover, gameCoverArraySchema } from "@/types/game/game";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { usersToGames } from "db/schema/users";
import { useState } from "react";
import { z } from "zod";
import { zx } from "zodix";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  // Search results from IGDB
  let searchResults: GameCover[] = [];

  if (search) {
    const results = await fetchGamesFromIGDB(IGDB_BASE_URL, {
      search: search,
      fields: ["name", "cover.image_id"],
      limit: 100,
      filters: [
        "cover.image_id != null",
        "rating != null",
        "rating > 50",
        "follows > 5",
        "parent_game = null",
        "version_parent = null",
        "themes != (42)",
      ],
    });

    try {
      const parsedGames = gameCoverArraySchema.parse(results);
      searchResults = parsedGames;
    } catch (e) {
      console.error(e);
    }
  }

  // Recently saved games from our database
  const recentlySavedGames = await db.query.usersToGames.findMany({
    with: {
      game: {
        with: {
          cover: true,
        }
      }
    },
  })

  // this is a bit of a hack, but it works for now
  const gamesWithCovers = recentlySavedGames.filter((game) => {
    return game.game?.cover !== null && game.game?.cover !== undefined;
  });

  return json({ searchResults, gamesWithCovers, session });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await zx.parseFormSafe(request, {
    gameId: zx.NumAsString,
    userId: z.string(),
  });

  if (formData.success) {
    // save a game to the user's collection
    const savedGame = await db
      .insert(usersToGames)
      .values({
        gameId: formData.data.gameId,
        userId: formData.data.userId,
      })
      .returning();

    return json({
      success: savedGame,
    });
  } else {
    return json({
      error: formData.error,
    });
  }
};

// Filter State:
// Multi-select for genres

export default function ExploreRoute() {
  const { searchResults, gamesWithCovers, session } = useLoaderData<typeof loader>();
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-3 flex flex-col gap-y-6">
          <Form method="get" className="flex max-w-md gap-3">
            <Input name="search" type="search" placeholder="What are you looking for?" />
            <Button variant={"secondary"}>Search</Button>
          </Form>
          <Separator />
          <h1>Recently Saved Games</h1>
          <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {gamesWithCovers.map((game) => (
              <GameCard key={game.gameId} coverId={game.game.cover.imageId}>
                <SearchEntryControls gameId={game.gameId} userId={session.id} />
              </GameCard>
            ))}
          </div>
          <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {searchResults.map((game) => (
              <GameCard key={game.id} coverId={game.cover.image_id}>
                <SearchEntryControls gameId={game.id} userId={session.id} />
              </GameCard>
            ))}
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Lets find what you are looking for</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup>
                <RadioGroupItem value="all">All</RadioGroupItem>
                <RadioGroupItem value="filtered">Filtered</RadioGroupItem>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
