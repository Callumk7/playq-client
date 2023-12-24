import { auth } from "@/features/auth/helper";
import { insertGameToPlaylistSchema } from "@/types/api";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { gamesOnPlaylists, playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { zx } from "zodix";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userPlaylists = await db.query.playlists.findMany({
    where: eq(playlists.creatorId, session.id),
    with: {
      creator: true,
    },
  });

  return json({ userPlaylists });
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

export default function PlaylistView() {
  const { userPlaylists } = useLoaderData<typeof loader>();

  return (
    <div>
      {userPlaylists.map((pl) => (
        <div key={pl.id}>
          <h2>{pl.name}</h2>
          <p>{pl.creator.username}</p>
        </div>
      ))}
    </div>
  );
}
