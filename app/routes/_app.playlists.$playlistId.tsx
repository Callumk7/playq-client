import { auth } from "@/features/auth/helper";
import { GameCover } from "@/features/library/game-cover";
import { LibraryView } from "@/features/library/library-view";
import { insertGameToPlaylistSchema } from "@/types/api";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { gamesOnPlaylists, playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { zx } from "zodix";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { playlistId } = params;
  const session = await auth(request);
  const playlistGames = await db.query.playlists.findFirst({
    where: eq(playlists.id, playlistId!),
    with: {
      games: {
        with: {
          game: {
            with: {
              cover: true,
            },
          },
        },
      },
    },
  });

  const allPlaylists = await db.query.playlists.findMany({
    where: eq(playlists.creatorId, session.id),
  });

  return typedjson({ playlistId, playlistGames, allPlaylists });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const res = await zx.parseFormSafe(request, insertGameToPlaylistSchema);

  if (res.success) {
    const addedGame = await db.insert(gamesOnPlaylists).values({
      playlistId: res.data.playlistId,
      gameId: res.data.gameId,
      addedBy: res.data.addedBy,
    });

    return json({ addedGame });
  } else {
    return json({ error: res.error });
  }
};

export default function PlaylistRoute() {
  const { playlistId, playlistGames, allPlaylists } = useTypedLoaderData<typeof loader>();
  return (
    <LibraryView>
      {playlistGames?.games.map((game) => (
        <GameCover
          key={game.game.id}
          coverId={game.game.cover.imageId}
          gameId={game.gameId}
          playlists={allPlaylists}
        >
          Controls
        </GameCover>
      ))}
    </LibraryView>
  );
}
