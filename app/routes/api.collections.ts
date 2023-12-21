import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/users";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request }: ActionFunctionArgs) => {
	// This action needs to handle POST and DELETE requests for games
	// being added or removed from a user's collection.

	// POST /api/collections
	if (request.method === "POST") {
		const formData = await zx.parseFormSafe(request, {
			gameId: zx.NumAsString,
			userId: z.string(),
		});

		if (formData.success) {
			// save a game to the user's collection
			const savedGame = await db
				.insert(usersToGames)
				.values({
					gameId: formData.data.gameId,
					userId: formData.data.userId,
				})
				.returning();

			return json({
				success: savedGame,
			});
		} else {
			return json({
				error: formData.error,
			});
		}
	}

	// DELETE /api/collections
	if (request.method === "DELETE") {
		const formData = await zx.parseFormSafe(request, {
			gameId: zx.NumAsString,
			userId: z.string(),
		});

		if (formData.success) {
			// remove a game from the user's collection
			const removedGame = await db
				.delete(usersToGames)
				.where(
					and(
						eq(usersToGames.userId, formData.data.userId),
						eq(usersToGames.gameId, formData.data.gameId),
					),
				);

			return json({
				success: removedGame,
			});
		} else {
			return json({
				error: formData.error,
			});
		}
	}
};
