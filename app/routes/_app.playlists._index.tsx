import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import {  playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

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
