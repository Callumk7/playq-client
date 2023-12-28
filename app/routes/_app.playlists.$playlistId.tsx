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
  const result = await zx.parseFormSafe(request, insertGameToPlaylistSchema);

  if (result.success) {
    const addedGame = await db.insert(gamesOnPlaylists).values({
      playlistId: result.data.playlistId,
      gameId: result.data.gameId,
      addedBy: result.data.addedBy,
    });

    return json({ addedGame });
  } else {
    return json({ error: result.error });
  }
};

export default function PlaylistRoute() {
  const { playlistWithGames, allPlaylists } = useTypedLoaderData<typeof loader>();
  return (
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
  );
}
