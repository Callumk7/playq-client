import { IGDB_BASE_URL } from "@/constants";
import { auth } from "@/features/auth/helper";
import { SearchEntryControls } from "@/features/explore/components/search-entry-controls";
import { GameCard } from "@/features/library/game-card";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGame, IGDBGameSchema } from "@/types/igdb/reponses";
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
  });

  // iterate over these to create promises to get each game from the external store
  const fetchGamePromises = userCollection.map(async (game) =>
    fetchGamesFromIGDB(IGDB_BASE_URL, {
      fields: "full",
      filters: [`id = ${game.gameId}`],
    }),
  );

  // fetch each game in parallel
  const fetchedGames = await Promise.all(fetchGamePromises);

  const games: IGDBGame[] = [];

  // in this way, we should get a partial array, even if we have some zod problems
  fetchedGames.forEach((fetchedGame) => {
    try {
      games.push(IGDBGameSchema.parse(fetchedGame[0]));
    } catch (e) {
      console.error(e);
    }
  });

  return json({ userCollection, games, session });
};

export default function CollectionRoute() {
  const { games, session } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {games.map((game) => (
        <GameCard key={game.id} game={game}>
          <SearchEntryControls gameId={game.id} userId={session.id} />
        </GameCard>
      ))}
    </div>
  );
}
