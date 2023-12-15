import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { IGDB_BASE_URL } from "@/constants";
import { GameCard } from "@/features/library/game-card";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { GameCover, gameCoverArray } from "@/types/game/game";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
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

  return json({ searchResults });
};

export default function ExploreRoute() {
  const { searchResults } = useLoaderData<typeof loader>();
  return (
    <div>
      <Form method="get" className="flex gap-3">
        <Input name="search" type="search" placeholder="What are you looking for?" />
        <Button>Search</Button>
      </Form>
      <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {searchResults.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
