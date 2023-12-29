import { auth } from "@/features/auth";
import {
  CollectionGame,
  CollectionMenubar,
  getUserGameCollection,
} from "@/features/collection";
import { transformCollectionIntoGames } from "@/features/collection/lib/get-game-collection";
import { LibraryView, useSearch } from "@/features/library";
import { getUserPlaylists } from "@/features/playlists";
import { GameWithCollection } from "@/types/games";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

///
/// LOADER FUNCTION
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userCollectionPromise = getUserGameCollection(session.id);
  const userPlaylistsPromise = getUserPlaylists(session.id);

  const [userCollection, userPlaylists] = await Promise.all([
    userCollectionPromise,
    userPlaylistsPromise,
  ]);

  const games: GameWithCollection[] = transformCollectionIntoGames(userCollection);

  return typedjson({ session, userPlaylists, games });
};

///
/// ROUTE
///
export default function CollectionRoute() {
  const { session, userPlaylists, games } = useTypedLoaderData<typeof loader>();

  const { searchTerm, searchedGames, handleSearchTermChanged } =
    useSearch(games);

  return (
    <div>
      <CollectionMenubar
        userId={session.id}
        searchTerm={searchTerm}
        handleSearchTermChanged={handleSearchTermChanged}
      />
      <LibraryView>
        {searchedGames.map((game) => (
          <CollectionGame
            game={game}
            userId={session.id}
            gameId={game.gameId}
            coverId={game.cover.imageId}
            key={game.gameId}
            userPlaylists={userPlaylists}
            gamePlaylists={game.playlists}
          />
        ))}
      </LibraryView>
    </div>
  );
}
