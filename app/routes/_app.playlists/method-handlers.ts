import { activityManager } from "@/services/events/events.server";
import { data } from "@remix-run/node";
import { uuidv4 } from "callum-util";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { redirect } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";

// POST
export const postRequestHandler = async (request: Request) => {
	const result = await zx.parseFormSafe(request, {
		playlistName: z.string(),
		userId: z.string(),
		isPrivate: z.string().optional(),
	});

	if (!result.success) {
		return data({ error: result.error }, { status: 400 });
	}

	const { playlistName, userId, isPrivate } = result.data;
	const isPrivateBool = isPrivate === "on";
	const newId = `pl_${uuidv4()}`;

	const createdPlaylist = await db
		.insert(playlists)
		.values({
			id: newId,
			name: playlistName,
			creatorId: userId,
			isPrivate: isPrivateBool,
		})
		.returning();

	activityManager.createPlaylist(userId, newId);

	return redirect(`/playlists/view/${createdPlaylist[0].id}`);
};
