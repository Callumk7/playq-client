import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { IGDB_BASE_URL } from "@/constants";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import {
  IGDBGame,
  IGDBGameNoArtwork,
  IGDBGameNoArtworkSchemaArray,
  IGDBGameSchemaArray,
} from "@/types/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  let searchResults: IGDBGameNoArtwork[] = [];

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
        // "first_release_date >= 1577836800"
      ],
    });

    console.log(results[0]);

    try {
      const parsedGames = IGDBGameNoArtworkSchemaArray.parse(results);
      searchResults = parsedGames;
    } catch (e) {
      console.error(e);
    }
  }

  console.log(searchResults[0]);
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
      <div className="mt-4">
        {searchResults.map((game) => (
          <div key={game.id}>{game.name}</div>
        ))}
      </div>
    </div>
  );
}
