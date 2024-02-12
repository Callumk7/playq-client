import { db } from "db";
import { usersToGames } from "db/schema/games";
import { eq } from "drizzle-orm";

export const getUserCollection = async (userId: string) => {
	const userCollection = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, userId),
		with: {
			game: true,
		},
		columns: {},
	});

	return userCollection;
};

export const getUserGamesWithDetails = async (userId: string) => {
	const userCollection = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, userId),
		with: {
			game: {
				with: {
					cover: true,
					playlists: {
						with: {
							playlist: true,
						},
					},
					genres: {
						with: {
							genre: true,
						},
					},
					screenshots: true,
					artworks: true,
				},
			},
		},
	});

	return userCollection;
};

export const getUserCollectionGameIds = async (userId: string) => {
	const gameIds = await db.query.usersToGames
		.findMany({
			where: eq(usersToGames.userId, userId),
			columns: {
				gameId: true,
			},
		})
		.then((game) => game.map((g) => g.gameId));

	return gameIds;
};
