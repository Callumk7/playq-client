import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { createServerClient, getSession } from "@/features/auth";
import { getCollectionGameIds } from "@/features/collection";
import { getAllGenres } from "@/features/collection/queries/get-user-genres";
import { ExploreGameInternal } from "@/features/explore/components/search-game";
import { useRouteData } from "@/features/explore/hooks/use-initial-data";
import { markInternalResultsAsSaved } from "@/features/explore/lib/mark-results-as-saved";
import { LibraryView } from "@/features/library";
import { GenreFilter } from "@/features/library/components/genre-filter";
import { useExploreStore } from "@/store/explore";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { covers, games, genres, genresToGames } from "db/schema/games";
import { eq, ilike, inArray, and, gt } from "drizzle-orm";
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
  const rating = Number(url.searchParams.get("rating"));
  const follows = Number(url.searchParams.get("follows"));

  const conditions = [gt(games.externalFollows, follows), gt(games.rating, rating)];

  if (search) conditions.push(ilike(games.title, `%${search}%`));
  if (genreSearch.length > 0) conditions.push(inArray(genres.name, genreSearch));

  const searchResults = await db
    .select()
    .from(genresToGames)
    .innerJoin(genres, eq(genresToGames.genreId, genres.id))
    .innerJoin(games, eq(games.gameId, genresToGames.gameId))
    .leftJoin(covers, eq(games.gameId, covers.gameId))
    .where(and(...conditions))
    .limit(150)
    .orderBy(games.rating, games.externalFollows);

  const uniqueGames = searchResults.filter(
    (res, i, self) => i === self.findIndex((t) => t.games.id === res.games.id),
  );

  // this mutates the shape of the result
  const gameIds = await getCollectionGameIds(session.user.id);
  const resultsMarkedAsSaved = markInternalResultsAsSaved(uniqueGames, gameIds);

  const allGenres = await getAllGenres();
  const genreNames = allGenres.map((g) => g.name);

  return typedjson({ resultsMarkedAsSaved, session, genreNames });
};

export default function ExploreRoute() {
  const { data, fetcher } = useRouteData<typeof loader>();

  // We are filtering on the results, and the filter state is kept in the store
  const store = useExploreStore();

  return (
    <div className="mb-12">
      <div className="flex flex-col gap-y-6">
        <div className="flex gap-3">
          <fetcher.Form method="get" className="flex flex-col gap-3">
            <Label>Title</Label>
            <Input
              name="search"
              type="search"
              placeholder="What are you looking for?"
              className="w-[360px]" // This needs to be responsive
            />
            {store.genreFilter.map((g) => (
              <input key={g} type="hidden" name="genres" value={g} />
            ))}
            <Label>Rating</Label>
            <Slider name="rating" />
            <Label>Follows</Label>
            <Slider name="follows" />
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
          {data.resultsMarkedAsSaved.map((result) => (
            <ExploreGameInternal
              key={result.games.id}
              game={{ ...result.games, cover: result.covers!, saved: result.saved }}
              userId={data.session.user.id}
            />
          ))}
        </LibraryView>
      </div>
    </div>
  );
}
