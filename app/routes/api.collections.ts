import { WORKER_URL } from "@/constants";
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
			const { gameId, userId } = formData.data;
			// save a game to the user's collection
			const savedGame = await db
				.insert(usersToGames)
				.values({
					gameId,
					userId
				})
				.onConflictDoNothing()
				.returning();

			// This is offloading the work to a cloudflare worker
			await fetch(`${WORKER_URL}/games/${gameId}`, {
				method: "POST",
			}).then((res) => {
				if (res.ok) {
					console.log(`Successfully saved ${gameId} to our database.`);
				} else {
					console.error(`Failed to save ${gameId} to our database.`);
				}
			});

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
