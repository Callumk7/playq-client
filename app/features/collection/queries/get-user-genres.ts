import { Genre } from "@/types/games";
import { db } from "db";
import { genres, genresToGames, usersToGames } from "db/schema/games";
import { eq, inArray } from "drizzle-orm";

// Genre and Count
export const getGenresAndCount = async (userCollectionIds: number[]) => {
	const getAllGenres = await db.query.genresToGames.findMany({
		where: inArray(genresToGames.gameId, userCollectionIds),
	});

	console.log(getAllGenres);
	return getAllGenres;
};

export const getAllGenres = async () => {
	const allGenres = await db.selectDistinct().from(genres);
	return allGenres;
};

export const genresToStrings = (genres: Genre[]): string[] => {
	return genres.map((genre) => genre.name);
};
