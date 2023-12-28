import { auth } from "@/features/auth/helper";
import { CollectionGame } from "@/features/collection/components/collection-game";
import { CollectionMenubar } from "@/features/collection/components/collection-menubar";
import { useSearch } from "@/features/collection/hooks/search";
import { getUserGameCollection } from "@/features/collection/lib/get-game-collection";
import { LibraryView } from "@/features/library";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

///
/// LOADER FUNCTION
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userCollection = await getUserGameCollection(session.id);
  const games = userCollection.map((c) => c.game);

  const userPlaylists = await db.query.playlists.findMany({
    where: eq(playlists.creatorId, session.id),
  });

  return typedjson({ userCollection, session, userPlaylists, games });
};

///
/// ROUTE 
///
export default function CollectionRoute() {
  const { session, userPlaylists, games } =
    useTypedLoaderData<typeof loader>();

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
