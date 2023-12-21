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
import { IGDB_BASE_URL } from "@/constants";
import { auth } from "@/features/auth/helper";
import { getCollectionGameIds } from "@/features/collection/lib/get-collection-gameIds";
import { SearchEntryControls } from "@/features/explore/components/search-entry-controls";
import { markResultsAsSaved } from "@/features/explore/lib/mark-results-as-saved";
import { GameCover } from "@/features/library/game-cover";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGame, IGDBGameSchemaArray } from "@/types/igdb";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { usersToGames } from "db/schema/users";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { z } from "zod";
import { zx } from "zodix";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get the signed in user's collection, so we can display which games they already have
  const session = await auth(request);
  const gameIds = await getCollectionGameIds(session.id);

  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  // Search results from IGDB
  let searchResults: IGDBGame[] = [];

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
      const parsedGames = IGDBGameSchemaArray.parse(results);
      searchResults = parsedGames;
    } catch (e) {
      console.error(e);
    }
  }

  const resultsMarkedAsSaved = markResultsAsSaved(searchResults, gameIds);

  return json({ resultsMarkedAsSaved, session });
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
  const { resultsMarkedAsSaved, session } = useLoaderData<typeof loader>();
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-3 flex flex-col gap-y-6">
          <Form method="get" className="flex max-w-md gap-3">
            <Input name="search" type="search" placeholder="What are you looking for?" />
            <Button variant={"secondary"}>Search</Button>
          </Form>
          <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {resultsMarkedAsSaved.map((game) => (
              <GameCover key={game.id} coverId={game.cover.image_id}>
                <SearchEntryControls isSaved={game.saved} gameId={game.id} userId={session.id} />
              </GameCover>
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
