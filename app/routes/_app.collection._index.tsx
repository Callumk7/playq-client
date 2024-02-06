import { Progress } from "@/components/ui/progress";
import { createServerClient, getSession } from "@/features/auth";
import {
  CollectionGame,
  CollectionMenubar,
  getUserGameCollection,
} from "@/features/collection";
import { transformCollectionIntoGames } from "@/features/collection/queries/get-game-collection";
import { getUserGenres } from "@/features/collection/queries/get-user-genres";
import { LibraryView, useFilter, useSearch } from "@/features/library";
import { GenreFilter } from "@/features/library/components/genre-filter";
import { useSort } from "@/features/library/hooks/sort";
import { getUserPlaylists } from "@/features/playlists";
import useFilterStore from "@/store/filters";
import { GameWithCollection } from "@/types/games";
import { Label } from "@radix-ui/react-context-menu";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, redirect, useTypedLoaderData } from "remix-typedjson";

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

  userCollection.forEach((c) => {
    if (!c.game) {
      console.log(c.gameId);
    }
  });

  // Not sure about this transform function. At this point, it might be too
  // arbitrary. Consider the data needs and review at a later date.
  const games: GameWithCollection[] = transformCollectionIntoGames(userCollection);
  const genreNames = allGenres.map((genre) => genre.name);

  return typedjson({ session, userPlaylists, games, genreNames });
};

export default function CollectionIndex() {
  const { userPlaylists, games, session, genreNames } =
    useTypedLoaderData<typeof loader>();

  const { filteredGames } = useFilter(games, genreNames);
  const { searchedGames } = useSearch(filteredGames);
  const { sortedGames } = useSort(searchedGames);

  // For the progress bars
  const gameCount = games.length;
  const playedGames = games.filter((game) => game.played).length;
  const completedGames = games.filter((game) => game.completed).length;

  // We pass state from the filter store here, so the genre-filter component
  // can be reused in other routes
  const genreFilter = useFilterStore((state) => state.genreFilter);
  const handleGenreToggled = useFilterStore((state) => state.handleGenreToggled);
  const handleToggleAllGenres = useFilterStore((state) => state.handleToggleAllGenres);

  return (
    <>
      <div className="mb-8">
        <GenreFilter
          genres={genreNames}
          genreFilter={genreFilter}
          handleGenreToggled={handleGenreToggled}
          handleToggleAllGenres={handleToggleAllGenres}
        />
      </div>
      <CollectionMenubar userId={session.user.id} />
      <div className="my-6">
        <CollectionProgress
          gameCount={gameCount}
          playedGames={playedGames}
          completedGames={completedGames}
        />
      </div>
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
          />
        ))}
      </LibraryView>
    </>
  );
}

function CollectionProgress({
  gameCount,
  playedGames,
  completedGames,
}: {
  gameCount: number;
  playedGames: number;
  completedGames: number;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label>Played</Label>
        <Progress value={playedGames} max={gameCount} />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Completed</Label>
        <Progress value={completedGames} max={gameCount} />
      </div>
    </div>
  );
}
