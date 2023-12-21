import { IGDB_BASE_URL, WORKER_URL } from "@/constants";
import { auth } from "@/features/auth/helper";
import { GameSearch } from "@/features/collection/components/game-search";
import { SearchEntryControls } from "@/features/explore/components/search-entry-controls";
import { GameCover } from "@/features/library/game-cover";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGameNoArtwork, IGDBGameNoArtworkSchema } from "@/types/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { usersToGames } from "db/schema/users";
import { eq } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // Get the entire collection for this user. We WILL want to be using react-query for this,
  // so lets consider setting that up.
  //
  // We need to figure out a good way of defining a function that can run on both the server
  // and the client (or have two separate functions that return the same data)

  // Get all the external game Ids from our own database
  const userCollection = await db.query.usersToGames.findMany({
    where: eq(usersToGames.userId, session.id),
    with: {
      game: {
        with: {
          cover: true,
        },
      },
    },
  });

  console.log(userCollection);

  const gameIds: number[] = [];
  userCollection.forEach((game) => {
    gameIds.push(game.gameId);
  });

  // WARN: This is a really weird way to save games to our database. I would rather
  // perform the save when a user adds a game to their collection. I want this work
  // ideally to be done in the background, but I don't know how to do that yet.
  //
  userCollection.forEach(async (game) => {
    if (!game.game) {
      const res = await fetch(`${WORKER_URL}/games/${game.gameId}`, {
        method: "POST",
      });
      if (res.ok) {
        console.log(`Successfully saved ${game.gameId} to our database.`);
      } else {
        console.error(`Failed to save ${game.gameId} to our database.`);
      }
    }
  });

  // This could be where I use react-query, as well as where I check to see if I need
  // to save this data to our db.
  const rawGames = await fetchGamesFromIGDB(IGDB_BASE_URL, {
    fields: "full",
    limit: 100,
    filters: [`id = (${gameIds.join(",")})`],
  });

  const games: IGDBGameNoArtwork[] = [];
  rawGames.forEach((rawGame) => {
    try {
      games.push(IGDBGameNoArtworkSchema.parse(rawGame));
    } catch (e) {
      console.error(e);
    }
  });

  return json({ userCollection, games, session });
};

export default function CollectionRoute() {
  const { games, session } = useLoaderData<typeof loader>();
  return (
    <div>
      <GameSearch userId={session.id} />
      <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {games.map((game) => (
          <GameCover key={game.id} coverId={game.cover.image_id}>
            <SearchEntryControls gameId={game.id} userId={session.id} />
          </GameCover>
        ))}
      </div>
    </div>
  );
}
