import { WORKER_URL } from "@/constants";
import { activityManager } from "@/services/events/events.server";
import { json } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { and, eq } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { zx } from "zodix";

///
/// POST
///
export const postRequestHandler = async (request: Request) => {
	const result = await zx.parseFormSafe(request, {
		gameId: zx.NumAsString,
		userId: z.string(),
	});

	if (!result.success) {
		return json(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
	}

	const { gameId, userId } = result.data;

	const savedGame = await db
		.insert(usersToGames)
		.values({
			gameId,
			userId,
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

	// add to activity feed
	activityManager.addToCollection(userId, gameId);

	return json(
		{ savedGame },
		{ status: StatusCodes.CREATED, statusText: ReasonPhrases.CREATED },
	);
};

///
/// DELETE
///
export const deleteRequestHandler = async (request: Request) => {
	console.log("THIS IS THE NEW DELETE REQUEST HANDLER");
	const result = await zx.parseFormSafe(request, {
		gameId: zx.NumAsString,
		userId: z.string(),
	});

	if (!result.success) {
		return json(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
	}

	const { gameId, userId } = result.data;

	await db
		.delete(usersToGames)
		.where(and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId)));

	activityManager.removeFromCollection(userId, gameId);

	return new Response(undefined, {
		status: StatusCodes.NO_CONTENT,
		statusText: ReasonPhrases.NO_CONTENT,
	});
};
