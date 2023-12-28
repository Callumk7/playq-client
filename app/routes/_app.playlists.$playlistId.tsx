import { auth } from "@/features/auth";
import { GameCover, LibraryView } from "@/features/library";
import { getPlaylistWithGames, getUserPlaylists } from "@/features/playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";

///
/// LOADER 
///
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

///
/// ROUTE 
///
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
