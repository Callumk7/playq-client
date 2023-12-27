import { auth } from "@/features/auth/helper";
import { CollectionControls } from "@/features/collection/components/collection-controls";
import { CollectionMenubar } from "@/features/collection/components/collection-menubar";
import { GameSearch } from "@/features/collection/components/game-search";
import { getUserGameCollection } from "@/features/collection/lib/get-game-collection";
import { GameCover } from "@/features/library/game-cover";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userCollection = await getUserGameCollection(session.id);

  return typedjson({ userCollection, session });
};

export default function CollectionRoute() {
  const { session, userCollection } = useTypedLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex w-full justify-start gap-4">
        <GameSearch userId={session.id} />
        <CollectionMenubar />
      </div>
      <div className="grid grid-cols-1 gap-4 rounded-md py-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {userCollection.map((game, i) => {
          if (game.game.cover !== null) {
            return (
              <GameCover key={game.gameId} coverId={game.game.cover.imageId}>
                <CollectionControls gameId={game.gameId} userId={session.id} index={i} />
              </GameCover>
            );
          }
        })}
      </div>
    </div>
  );
}
