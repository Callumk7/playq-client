import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { gamesOnPlaylists } from "db/schema/playlists";
import { zx } from "zodix";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const session = await auth(request);

	const playlistId = params.playlistId;

	if (!playlistId) {
		return json("No playlist id provider", { status: 400 })
	}

	const data = await zx.parseFormSafe(request, {
		gameId: zx.NumAsString,
	});

	if (data.success) {
		const addedGame = await db.insert(gamesOnPlaylists).values({
			playlistId: playlistId,
			gameId: data.data.gameId,
			addedBy: session.id,
		})

		return json({ addedGame });
	}

	return json({ session });
};
