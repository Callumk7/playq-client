import { db } from "db";
import { usersToGames } from "db/schema/games";
import { eq } from "drizzle-orm";

export const getCollectionGenres = async (userId: string) => {
	const collectionGenres = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, userId),
		with: {
			game: {
				with: {
					genres: {
						with: {
							genre: true,
						},
					},
				},
			},
		},
	});

	const genres = collectionGenres
		.map((collectionGenre) => {
			return collectionGenre.game.genres.map((g) => g.genre.name);
		})
		.flat();

	return [...new Set(genres)];
};
