import { activityManager } from "@/services/events/events.server";
import { InsertUsersToGames } from "@/types";
import { data } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { and, eq } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { zx } from "zodix";

export const putRequestHandler = async (request: Request, params: { userId: string }) => {
	const userId = params.userId;

	const result = await zx.parseFormSafe(request, {
		gameId: zx.NumAsString,
		played: zx.BoolAsString.optional(),
		completed: zx.BoolAsString.optional(),
		starred: zx.BoolAsString.optional(),
		rating: zx.NumAsString.optional(),
		pinned: zx.BoolAsString.optional(),
	});

	if (!result.success) {
		return data(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
	}

	const gameUpdate: InsertUsersToGames = {
		userId,
		gameId: result.data.gameId,
	};

	if (result.data.played !== undefined) {
		gameUpdate.played = result.data.played;
	}
	if (result.data.completed !== undefined) {
		gameUpdate.completed = result.data.completed;
	}
	if (result.data.starred !== undefined) {
		console.log("Game Starring not yet implemented on the database...");
	}
	if (result.data.rating) {
		gameUpdate.playerRating = result.data.rating;
	}
	if (result.data.pinned !== undefined) {
		gameUpdate.pinned = result.data.pinned;
	}

	const updateGame = await db
		.update(usersToGames)
		.set(gameUpdate)
		.where(
			and(
				eq(usersToGames.userId, userId),
				eq(usersToGames.gameId, result.data.gameId),
			),
		)
		.returning();

	if (gameUpdate.played) {
		activityManager.markGameAsPlayed(userId, result.data.gameId);
	}
	if (gameUpdate.completed) {
		activityManager.markGameAsCompleted(userId, result.data.gameId);
	}
	if (gameUpdate.playerRating) {
		activityManager.rateGame(userId, result.data.gameId, result.data.rating!);
	}

	return data({ updateGame }, { status: StatusCodes.OK });
};
