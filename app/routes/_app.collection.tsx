import { auth } from "@/features/auth/helper";
import { CollectionControls } from "@/features/collection/components/collection-controls";
import { CollectionMenubar } from "@/features/collection/components/collection-menubar";
import { GameSearch } from "@/features/collection/components/game-search";
import { getUserGameCollection } from "@/features/collection/lib/get-game-collection";
import { GameCover } from "@/features/library/game-cover";
import { LibraryView } from "@/features/library/library-view";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userCollection = await getUserGameCollection(session.id);

  const userPlaylists = await db.query.playlists.findMany({
    where: eq(playlists.creatorId, session.id),
  });

  return typedjson({ userCollection, session, userPlaylists });
};

export default function CollectionRoute() {
  const { session, userCollection, userPlaylists } = useTypedLoaderData<typeof loader>();

  return (
    <div>
      <CollectionMenubar userId={session.id} />
      <LibraryView>
        {userCollection.map((game, i) => (
          <GameCover
            key={game.gameId}
            coverId={game.game.cover.imageId}
            gameId={game.gameId}
            playlists={userPlaylists}
          >
            <CollectionControls gameId={game.gameId} userId={session.id} index={i} />
          </GameCover>
        ))}
      </LibraryView>
    </div>
  );
}
