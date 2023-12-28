import { auth } from "@/features/auth";
import {
  CollectionGame,
  CollectionMenubar,
  getCollectionGenres,
  getUserGameCollection,
} from "@/features/collection";
import { LibraryView, useSearch } from "@/features/library";
import { getUserPlaylists } from "@/features/playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

///
/// LOADER FUNCTION
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userCollectionPromise = getUserGameCollection(session.id);
  const userPlaylistsPromise = getUserPlaylists(session.id);
  const userGenresPromise = getCollectionGenres(session.id);

  const [userCollection, userPlaylists, genres] = await Promise.all([
    userCollectionPromise,
    userPlaylistsPromise,
    userGenresPromise,
  ]);

  const games = userCollection.map((g) => g.game);

  return typedjson({ session, userPlaylists, games, genres });
};

///
/// ROUTE
///
export default function CollectionRoute() {
  const { session, userPlaylists, games, genres } = useTypedLoaderData<typeof loader>();

  const { searchTerm, searchedGames, handleSearchTermChanged } = useSearch(games);

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
            userId={session.id}
            gameId={game.gameId}
            coverId={game.cover.imageId}
            key={game.gameId}
            userPlaylists={userPlaylists}
            gamePlaylists={game.playlists.map((p) => p.playlist)}
          />
        ))}
      </LibraryView>
    </div>
  );
}
