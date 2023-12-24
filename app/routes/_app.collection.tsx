import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { IGDB_BASE_URL } from "@/constants";
import { auth } from "@/features/auth/helper";
import { CollectionControls } from "@/features/collection/components/collection-controls";
import { GameSearch } from "@/features/collection/components/game-search";
import { getUserGameCollection } from "@/features/collection/lib/get-game-collection";
import { GameCover } from "@/features/library/game-cover";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGameNoArtwork, IGDBGameNoArtworkSchema } from "@/types/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userCollection = await getUserGameCollection(session.id);

  const gameIds: number[] = [];
  userCollection.forEach((game) => {
    gameIds.push(game.gameId);
  });

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
  const { session, userCollection, games } = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="flex w-full justify-between">
        <GameSearch userId={session.id} />
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Sort</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Alphabetical</MenubarItem>
              <MenubarItem>Recently Played</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Filters</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Completed</MenubarItem>
              <MenubarItem>Playing</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 rounded-md p-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {userCollection.map((game) => (
          <GameCover key={game.game.id} coverId={game.game.cover.imageId}>
            <CollectionControls gameId={game.gameId} userId={session.id} />
          </GameCover>
        ))}
      </div>
    </div>
  );
}
