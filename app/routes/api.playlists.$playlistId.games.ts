import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { gamesOnPlaylists } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";
import { zx } from "zodix";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const session = await auth(request);

	const playlistId = params.playlistId;
	if (!playlistId) {
		return json("No playlist id provider", { status: 400 });
	}

	const result = await zx.parseFormSafe(request, {
		gameId: zx.NumAsString,
	});

	if (result.success) {
		if (request.method === "POST") {
			const addedGame = await db.insert(gamesOnPlaylists).values({
				playlistId: playlistId,
				gameId: result.data.gameId,
				addedBy: session.id,
			});

			return json({ addedGame });
		}

		if (request.method === "DELETE") {
			const removedGame = await db
				.delete(gamesOnPlaylists)
				.where(
					and(
						eq(gamesOnPlaylists.playlistId, playlistId),
						eq(gamesOnPlaylists.gameId, result.data.gameId),
					),
				);

			return json({ removedGame });
		}
	}

	return json({ session });
};
