import { useSession } from "@/features/auth/components/session-context";
import { auth } from "@/features/auth/helper";
import { GameCover } from "@/features/library/game-cover";
import { LibraryView } from "@/features/library/library-view";
import { getPlaylistWithGames } from "@/features/playlists/queries/get-playlist-with-games";
import { getUserPlaylists } from "@/features/playlists/queries/get-user-playlists";
import { insertGameToPlaylistSchema } from "@/types/api";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { gamesOnPlaylists } from "db/schema/playlists";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { playlistId } = zx.parseParams(params, {
    playlistId: z.string(),
  });
  const session = await auth(request);

  const playlistWithGamesPromise = getPlaylistWithGames(playlistId);
  const allPlaylistsPromise = getUserPlaylists(session.id);

  const [playlistWithGames, allPlaylists] = await Promise.all([
    playlistWithGamesPromise,
    allPlaylistsPromise,
  ]);

  return typedjson({ playlistId, playlistWithGames, allPlaylists });
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
  const { playlistWithGames, allPlaylists } = useTypedLoaderData<typeof loader>();
  const session = useSession();
  return (
    <>
      <div>Your session id: {session?.id}</div>
      <LibraryView>
        {playlistWithGames?.games.map((game) => (
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
    </>
  );
}
