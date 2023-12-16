import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { IGDB_BASE_URL } from "@/constants";
import { auth } from "@/features/auth/helper";
import { SearchEntryControls } from "@/features/explore/components/search-entry-controls";
import { GameCard } from "@/features/library/game-card";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { GameCover, gameCoverArray } from "@/types/game/game";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { usersToGames } from "db/schema/users";
import { z } from "zod";
import { zx } from "zodix";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  let searchResults: GameCover[] = [];

  if (search) {
    const results = await fetchGamesFromIGDB(IGDB_BASE_URL, {
      search: search,
      fields: "full",
      limit: 10,
      filters: [
        "cover != null",
        "rating != null",
        "rating > 50",
        "follows > 10",
        "parent_game = null",
        "version_parent = null",
        "themes != (42)",
      ],
    });

    try {
      const parsedGames = gameCoverArray.parse(results);
      searchResults = parsedGames;
    } catch (e) {
      console.error(e);
    }
  }

  return json({ searchResults, session });
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

export default function ExploreRoute() {
  const { searchResults, session } = useLoaderData<typeof loader>();
  return (
    <div>
      <Form method="get" className="flex gap-3">
        <Input name="search" type="search" placeholder="What are you looking for?" />
        <Button>Search</Button>
      </Form>
      <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {searchResults.map((game) => (
          <GameCard key={game.id} game={game}>
            <SearchEntryControls gameId={game.id} userId={session.id} />
          </GameCard>
        ))}
      </div>
    </div>
  );
}
