import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { createServerClient, getSession } from "@/features/auth";
import { getAllGenres } from "@/features/collection/queries/get-user-genres";
import { ExploreGameInternal } from "@/features/explore/components/search-game";
import { useRouteData } from "@/features/explore/hooks/use-initial-data";
import { LibraryView } from "@/features/library";
import { GenreFilter } from "@/features/library/components/genre-filter";
import { useExploreStore } from "@/store/explore";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { covers, games, genres, genresToGames } from "db/schema/games";
import { eq, ilike, inArray, and, SQL } from "drizzle-orm";
import { useState } from "react";
import { redirect, typedjson } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // AUTH
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);
  if (!session) {
    return redirect("/?index", {
      headers,
    });
  }

  // use the URL for shared state.
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const genreSearch = url.searchParams.getAll("genres");

  let filters: SQL<unknown> | undefined;
  
  console.log(genreSearch)

  if (genreSearch.length > 0) {
    filters = and(ilike(games.title, `%${search}%`), inArray(genres.name, genreSearch));
  } else {
    filters = ilike(games.title, `%${search}%`);
  }

  const searchResults = await db
    .select()
    .from(genresToGames)
    .leftJoin(games, eq(games.gameId, genresToGames.gameId))
    .leftJoin(genres, eq(genresToGames.genreId, genres.id))
    .leftJoin(covers, eq(games.gameId, covers.gameId))
    .where(filters);

  console.log(searchResults)

  const allGenres = await getAllGenres();
  const genreNames = allGenres.map((g) => g.name);

  return typedjson({ searchResults, session, genreNames });
};

export default function ExploreRoute() {
  const { data, fetcher } = useRouteData<typeof loader>();

  const [searchTerm, setSearchTerm] = useState<string>("");

  // We are filtering on the results, and the filter state is kept in the store
  const store = useExploreStore();

  return (
    <div className="mb-12">
      <div className="flex flex-col gap-y-6">
        <div className="flex gap-3">
          <fetcher.Form method="get" className="flex gap-3">
            <Input
              name="search"
              type="search"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[360px]" // This needs to be responsive
            />
            {store.genreFilter.map(g => (
              <input key={g} type="hidden" name="genres" value={g} />
            ))}
            <Button variant={"outline"} type="submit">
              Search
            </Button>
          </fetcher.Form>
          <Button variant={"outline"} onClick={store.toggleShowFilters}>
            Advanced Filters
          </Button>
        </div>
        {store.showFilters && (
          <GenreFilter
            genres={data.genreNames}
            genreFilter={store.genreFilter}
            handleGenreToggled={store.handleGenreToggled}
            handleToggleAllGenres={store.handleToggleAllGenres}
          />
        )}
        <LibraryView>
          {data.searchResults.map((result) => (
            <ExploreGameInternal
              key={result.games!.id}
              game={{...result.games!, cover: result.covers!}}
              userId={data.session.user.id}
            />
          ))}
        </LibraryView>
      </div>
    </div>
  );
}
