import { auth } from "@/features/auth";
import {
  CollectionGame,
  CollectionMenubar,
  getCollectionGenres,
  getUserGameCollection,
} from "@/features/collection";
import { LibraryView, useSearch } from "@/features/library";
import { getUserPlaylists } from "@/features/playlists";
import { addPositionsToCollection } from "@/util/sort-array";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/users";
import { and, eq } from "drizzle-orm";
import { useState } from "react";
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

  // NOTE: I used this little snippet here to update the database. I should
  // probably remove the null possibility from the database, and instead have
  // the database just increment the position when a new entry is created.
  //
  // const collectionWithPositions = addPositionsToCollection(userCollection);
  // const promises: Promise<unknown>[] = [];
  // collectionWithPositions.forEach((c) => {
  //   promises.push(
  //     db
  //       .update(usersToGames)
  //       .set({
  //         position: c.position,
  //       })
  //       .where(and(eq(usersToGames.userId, c.userId), eq(usersToGames.gameId, c.gameId))),
  //   );
  // });
  //
  // await Promise.all(promises);

  userCollection.sort((a, b) => a.position! - b.position!);

  return typedjson({ session, userPlaylists, userCollection });
};

///
/// ROUTE
///
export default function CollectionRoute() {
  const { session, userPlaylists, userCollection } = useTypedLoaderData<typeof loader>();

  const { searchTerm, searchedGames, handleSearchTermChanged } =
    useSearch(userCollection);

  const [games, setGames] = useState(searchedGames);

  const moveGame = (gameId: number, direction: 1 | -1) => {
    const newGames = [...games];
    const index = newGames.findIndex((g) => g.game.gameId === gameId);

    // return early if we try to move the first game up, or the last game down
    if (index === 0 && direction === -1) return;
    if (index === newGames.length - 1 && direction === 1) return;

    const temp = newGames[index + direction].position!;
    newGames[index + direction].position = newGames[index].position!;
    newGames[index].position = temp;
    newGames.sort((a, b) => a.position! - b.position!);
    newGames.forEach((g, i) => {
      g.position = i;
    });

    setGames(newGames);
    // updateGamePositionToServer
  };

  return (
    <div>
      <CollectionMenubar
        userId={session.id}
        searchTerm={searchTerm}
        handleSearchTermChanged={handleSearchTermChanged}
      />
      <LibraryView>
        {games.map((game) => (
          <CollectionGame
            userId={session.id}
            gameId={game.game.gameId}
            coverId={game.game.cover.imageId}
            key={game.gameId}
            userPlaylists={userPlaylists}
            gamePlaylists={game.game.playlists.map((p) => p.playlist)}
            moveGame={moveGame}
          />
        ))}
      </LibraryView>
    </div>
  );
}
