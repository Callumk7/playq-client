import { auth } from "@/features/auth/helper";
import { GameCover } from "@/features/library/game-cover";
import { insertGameToPlaylistSchema } from "@/types/api";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { games } from "db/schema/games";
import { gamesOnPlaylists, playlists } from "db/schema/playlists";
import { eq, inArray } from "drizzle-orm";
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
              cover: true
            }
          }
        }
      }
    }
  })

  return json({ playlistId, playlistGames });
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
  }

  else {
    return json({ error: res.error });
  }
};



export default function PlaylistRoute() {
  const { playlistId, playlistGames } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Playlsit: {playlistId}</h1>
      {playlistGames?.games.map(game => (
        <GameCover key={game.game.id} coverId={game.game.cover.imageId} gameId={game.gameId} playlists={[]}>Controls</GameCover>
      ))}
    </div>
  )
}
