import { uuidv4 } from "@/util/generate-uuid";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { z } from "zod";
import { zx } from "zodix";

// This is the route handler for the "api/playlists" route.
// It will be called with a POST request.
export const action = async ({ request }: ActionFunctionArgs) => {

	if (request.method !== "POST") {
		return json({ error: "Method not allowed" }, { status: 405 });
	}

	const formData = await zx.parseFormSafe(request, {
		playlistName: z.string(),
		userId: z.string(),
	});

	if (!formData.success) {
		return json({ error: "Invalid form data" }, { status: 400 });
	}

	const { playlistName, userId } = formData.data;

	const createdPlaylist = await db
		.insert(playlists)
		.values({
			id: `pl_${uuidv4()}`,
			name: playlistName,
			creatorId: userId,
		})
		.returning();

	return json({ success: true, playlist: createdPlaylist });
};
