import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { IGDB_BASE_URL } from "@/constants";
import { auth } from "@/features/auth/helper";
import { getCollectionGameIds } from "@/features/collection/lib/get-collection-gameIds";
import { GenreFilter } from "@/features/explore/components/filters/genre-filter";
import { SearchEntryControls } from "@/features/explore/components/search-entry-controls";
import { markResultsAsSaved } from "@/features/explore/lib/mark-results-as-saved";
import { GameCover } from "@/features/library/game-cover";
import { FetchOptions, fetchGamesFromIGDB, fetchGenresFromIGDB } from "@/lib/igdb";
import { IGDBGame, IGDBGameSchemaArray, IGDBGenre, genreType } from "@/types/igdb";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { useTypedFetcher } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get the signed in user's collection, so we can display which games they already have
  const session = await auth(request);
  const gameIds = await getCollectionGameIds(session.id);

  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const genreIdsParam = url.searchParams.get("genre_ids");
  const genreIds: number[] = genreIdsParam ? genreIdsParam.split(",").map(Number) : [];

  // Search results from IGDB
  let searchResults: IGDBGame[] = [];
  const searchOptions: FetchOptions = {
    fields: ["name", "cover.image_id"],
    limit: 100,
    filters: [
      "cover != null",
      "parent_game = null",
      "version_parent = null",
      "themes != (42)",
    ],
  }

  if (search) {
    searchOptions.search = search;
    if (genreIds.length > 0) {
      searchOptions.filters?.push(`genres = (${genreIds.join(",")})`);
    }
  } else {
    searchOptions.sort = ["rating desc"];
    searchOptions.filters?.push("follows > 250", "rating > 80");
  }
  const results = await fetchGamesFromIGDB(IGDB_BASE_URL, searchOptions);

  try {
    const parsedGames = IGDBGameSchemaArray.parse(results);
    searchResults = parsedGames;
  } catch (e) {
    console.error(e);
  }

  const resultsMarkedAsSaved = markResultsAsSaved(searchResults, gameIds);

  return json({ resultsMarkedAsSaved, session });
};

export default function ExploreRoute() {
  const { resultsMarkedAsSaved, session } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <div>
      <div className="flex flex-col gap-y-6">
        <Form method="get" className="flex max-w-md gap-3">
          <Input name="search" type="search" placeholder="What are you looking for?" />
          <Button variant={"secondary"}>Search</Button>
        </Form>
        <div>
        </div>
        <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {resultsMarkedAsSaved.map((game) => (
            <GameCover key={game.id} coverId={game.cover.image_id}>
              <SearchEntryControls
                isSaved={game.saved}
                gameId={game.id}
                userId={session.id}
              />
            </GameCover>
          ))}
        </div>
      </div>
    </div>
  );
}
