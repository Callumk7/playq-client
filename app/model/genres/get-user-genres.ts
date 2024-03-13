import { db } from "db";
import { usersToGames, genresToGames, genres } from "db/schema/games";
import { eq, inArray } from "drizzle-orm";

export const getUserGenres = async (userId: string) => {
	const userGames = await db
		.select()
		.from(usersToGames)
		.where(eq(usersToGames.userId, userId));

	const gameIds = userGames.map((entry) => entry.gameId);

	// inArray requires atleast one value. new users will have no gameIds
	if (gameIds.length > 0) {
		const userGenresQueryArray = await db
			.selectDistinctOn([genresToGames.genreId])
			.from(genresToGames)
			.where(inArray(genresToGames.gameId, gameIds))
			.rightJoin(genres, eq(genresToGames.genreId, genres.id));

		const userGenres = userGenresQueryArray
			.filter((q) => q.genres !== null)
			.map((q) => q.genres);

		return userGenres;
	}

	return [];
};
