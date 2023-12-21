import { db } from "db";
import { usersToGames } from "db/schema/users";
import { eq } from "drizzle-orm";

export const getCollectionGameIds = async (userId: string): Promise<number[]> => {
	const userCollection = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, userId),
		columns: {
			gameId: true,
		},
	});

	const gameIds: number[] = [];
	userCollection.forEach((game) => {
		gameIds.push(game.gameId);
	});

	return gameIds;
};
