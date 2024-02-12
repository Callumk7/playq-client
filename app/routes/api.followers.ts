import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { followers } from "db/schema/playlists";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST" && request.method !== "DELETE") {
		return json("Method not allowed.", {
			status: 405,
			statusText: "Method Not Allowed",
		});
	}

	if (request.method === "POST") {
		const result = await zx.parseFormSafe(request, {
			playlistId: z.string(),
			userId: z.string(),
		});

		if (result.success) {
			const newFollow = await db
				.insert(followers)
				.values({
					playlistId: result.data.playlistId,
					userId: result.data.userId,
				})
				.onConflictDoNothing();

			return json({ newFollow });
		}
	}
};
