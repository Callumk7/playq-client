import { WORKER_URL } from "@/constants";
import { activityManager } from "@/services/events/events.server";
import { type ActionFunctionArgs, data } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { IGDBClient, SaveGameService } from "@/services";

const client = new IGDBClient(
	process.env.IGDB_CLIENT_ID!,
	process.env.IGDB_BEARER_TOKEN!,
);

export const action = async ({ request }: ActionFunctionArgs) => {
	// This action needs to handle POST and DELETE requests for games
	// being added or removed from a user's collection.

	// POST /api/collections
	if (request.method === "POST") {
		const result = await zx.parseFormSafe(request, {
			gameId: zx.NumAsString,
			userId: z.string(),
		});

		if (result.success) {
			const { gameId, userId } = result.data;
			// save a game to the user's collection
			const savedGame = await db
				.insert(usersToGames)
				.values({
					gameId,
					userId,
				})
				.onConflictDoNothing()
				.returning();

			// Migrated from random cloudflare worker here
			const service = new SaveGameService(db, client);
			await service.getGameFromIGDB(gameId);
			// This.. seems to be working..
			activityManager.addToCollection(userId, gameId);

			return data(
				{
					success: savedGame,
				},
				{ status: StatusCodes.CREATED, statusText: ReasonPhrases.CREATED },
			);
		}
		return data(
			{
				error: result.error,
			},
			{
				status: StatusCodes.BAD_REQUEST,
				statusText: ReasonPhrases.BAD_REQUEST,
			},
		);
	}

	// DELETE /api/collections
	if (request.method === "DELETE") {
		const result = await zx.parseFormSafe(request, {
			gameId: zx.NumAsString,
			userId: z.string(),
		});

		if (result.success) {
			const { gameId, userId } = result.data;
			// remove a game from the user's collection
			const removedGame = await db
				.delete(usersToGames)
				.where(
					and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId)),
				);

			activityManager.removeFromCollection(userId, gameId);

			return data({
				success: removedGame,
			});
		}
		return data({
			error: result.error,
		});
	}
};
