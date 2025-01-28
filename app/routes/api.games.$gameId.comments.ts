import { uuidv4 } from "callum-util";
import { ActionFunctionArgs, data } from "@remix-run/node";
import { db } from "db";
import { notes } from "db/schema/notes";
import { playlistComments } from "db/schema/playlists";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		const gameId = Number(params.gameId);
		const result = await zx.parseFormSafe(request, {
			user_id: z.string(),
			body: z.string(),
		});

		if (!result.success) {
			return data("failure", { status: 400 });
		}

		const newNote = await db
			.insert(notes)
			.values({
				id: `note_${uuidv4()}`,
				authorId: result.data.user_id,
				gameId: gameId,
				location: "game",
				content: result.data.body,
			})
			.returning();

		return { newNote };
	}

	return data("failure", { status: 400 });
};
