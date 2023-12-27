import { auth } from "@/features/auth/helper";
import { insertGameToPlaylistSchema } from "@/types/api";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { gamesOnPlaylists } from "db/schema/playlists";
import { zx } from "zodix";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { playlistId } = params;
  const session = await auth(request);

  return json({ playlistId });
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
  const { playlistId } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Playlsit: {playlistId}</h1>
    </div>
  )
}
