import { db } from "db";
import { usersToGames } from "db/schema/games";
import { eq } from "drizzle-orm";

export const getUserGameCollection = async (userId: string) => {
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
				},
			},
		},
	});

	return userCollection;
};
