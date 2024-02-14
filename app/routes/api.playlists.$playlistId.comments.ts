import { uuidv4 } from "@/util/generate-uuid";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { notes } from "db/schema/notes";
import { playlistComments } from "db/schema/playlists";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		const playlistId = String(params.playlistId);
		const result = await zx.parseFormSafe(request, {
			user_id: z.string(),
			body: z.string(),
		});

		if (!result.success) {
			return json("failure", { status: 400 });
		}

		const newComment = await db
			.insert(playlistComments)
			.values({
				id: `plc_${uuidv4()}`,
				authorId: result.data.user_id,
				playlistId: playlistId,
				body: result.data.body,
			})
			.returning();

		console.log("SUCCESS");
		console.log(newComment[0].body);

		const newNote = await db.insert(notes).values({
			id: `note_${uuidv4()}`,
			authorId: result.data.user_id,
			playlistId: playlistId,
			location: "playlist",
			content: result.data.body,
		}).returning();

		return json({ newComment, newNote });
	}

	return json("failure", { status: 400 });
};
