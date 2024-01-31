import { createServerClient, getSession } from "@/features/auth";
import {
  CollectionGame,
  CollectionMenubar,
  getUserGameCollection,
} from "@/features/collection";
import { transformCollectionIntoGames } from "@/features/collection/lib/get-game-collection";
import { getUserGenres } from "@/features/collection/lib/get-user-genres";
import { LibraryView, useFilter, useSearch } from "@/features/library";
import { GenreFilter } from "@/features/library/components/genre-filter";
import { useSort } from "@/features/library/hooks/sort";
import { getUserPlaylists } from "@/features/playlists";
import { GameWithCollection } from "@/types/games";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";

///
/// LOADER FUNCTION
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  if (!session) {
    // there is no session, therefore, we are redirecting
    // to the landing page. The `/?index` is required here
    // for Remix to correctly call our loaders
    return redirect("/?index", {
      // we still need to return response.headers to attach the set-cookie header
      headers,
    });
  }

  const userCollectionPromise = getUserGameCollection(session.user.id);
  const userPlaylistsPromise = getUserPlaylists(session.user.id);

  const allUserGenresPromise = getUserGenres(session.user.id);

  const [userCollection, userPlaylists, allGenres] = await Promise.all([
    userCollectionPromise,
    userPlaylistsPromise,
    allUserGenresPromise,
  ]);

  const games: GameWithCollection[] = transformCollectionIntoGames(userCollection);
  const gameIds = games.map((game) => game.gameId);
  const genreNames = allGenres.map((genre) => genre.name);

  return typedjson({ session, userPlaylists, games, genreNames });
};

///
/// ROUTE
///
export default function CollectionRoute() {
  const { userPlaylists, games, session, genreNames } =
    useTypedLoaderData<typeof loader>();

  const {
    filteredGames,
    handleGenreToggled,
    handleToggleAllGenres,
  } = useFilter(games, genreNames);
  const { searchedGames } = useSearch(filteredGames);
  const { sortedGames } = useSort(searchedGames);

  // Selected game functionality
  const [selectedGames, setSelectedGames] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  return (
    <div>
      <div className="mb-8">
        <GenreFilter
          genres={genreNames}
          handleGenreToggled={handleGenreToggled}
          handleToggleAllGenres={handleToggleAllGenres}
        />
      </div>
      <CollectionMenubar
        userId={session.user.id}
        isSelecting={isSelecting}
        setIsSelecting={setIsSelecting}
      />
      <LibraryView>
        {sortedGames.map((game) => (
          <CollectionGame
            game={game}
            userId={session.user.id}
            gameId={game.gameId}
            coverId={game.cover.imageId}
            key={game.id}
            userPlaylists={userPlaylists}
            gamePlaylists={game.playlists}
            isSelected={selectedGames.includes(game.gameId)}
            isSelecting={isSelecting}
            selectedGames={selectedGames}
            setSelectedGames={setSelectedGames}
          />
        ))}
      </LibraryView>
    </div>
  );
}
