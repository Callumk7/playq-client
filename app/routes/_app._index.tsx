import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { LibraryView } from "@/features/library";
import { GameCover } from "@/features/library/components/game-cover";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { games, usersToGames } from "db/schema/games";
import { gamesOnPlaylists } from "db/schema/playlists";
import { count, desc, inArray } from "drizzle-orm";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  if (!session) {
    return redirect("/login")
  }

  // games that are in the most playlists
  const popularGamesByPlaylist = db
    .select({
      gameId: gamesOnPlaylists.gameId,
      count: count(gamesOnPlaylists.gameId),
    })
    .from(gamesOnPlaylists)
    .groupBy(gamesOnPlaylists.gameId)
    .orderBy(desc(count(gamesOnPlaylists.gameId)));

  // games that are in the most collections
  const popularGamesByCollection = db
    .select({
      gameId: usersToGames.gameId,
      count: count(usersToGames.gameId),
    })
    .from(usersToGames)
    .groupBy(usersToGames.gameId)
    .orderBy(desc(count(usersToGames.gameId)));

  // we should perform both of the above at the same time..
  const [collectionGameData, playlistGameData] = await Promise.all([
    popularGamesByCollection,
    popularGamesByPlaylist,
  ]);

  // create maps for fast lookup
  const collectionMap = new Map();
  collectionGameData.forEach((entry) => {
    collectionMap.set(entry.gameId, entry.count);
  });

  const playlistMap = new Map();
  playlistGameData.forEach((entry) => {
    playlistMap.set(entry.gameId, entry.count);
  });

  // now we can get the rest of the game data based off that fetch..
  // using a Set to ensure we have unique values
  const gameIds = new Set<number>();
  collectionGameData.forEach((data) => gameIds.add(data.gameId));
  playlistGameData.forEach((data) => gameIds.add(data.gameId));

  const gameIdArray = [...gameIds];
  const gameData = await db.query.games.findMany({
    where: inArray(games.gameId, gameIdArray),
    with: {
      cover: true,
    },
  });

  const processedData = gameData.map((data) => {
    const collectionCount = collectionMap.get(data.gameId) || 0;
    const playlistCount = playlistMap.get(data.gameId) || 0;
    return {
      collectionCount: collectionCount,
      playlistCount: playlistCount,
      ...data,
    };
  });

  // sort by collection count
  processedData.sort(
    (a, b) =>
      (b.collectionCount ? b.collectionCount : 0) -
      (a.collectionCount ? a.collectionCount : 0),
  );

  return json({ processedData }, { headers });
};

export default function AppIndex() {
  const { processedData } = useLoaderData<typeof loader>();
  return (
    <Container>
      <LibraryView>
        {processedData.map((game) => (
          <div key={game.id}>
            <GameCover coverId={game.cover.imageId} />
            <p>Collection count: {game.collectionCount}</p>
            <p>playlist count: {game.playlistCount}</p>
          </div>
        ))}
      </LibraryView>
    </Container>
  );
}
