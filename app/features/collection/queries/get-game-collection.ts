import { GameWithCollection, gameWithCollectionSchema } from "@/types/games";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

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

type PromiseType<T> = T extends Promise<infer U> ? U : T;

/**
 * This function transforms data returned from the database into
 * a shape that we can use in our app, nice and flat. It does mean
 * that I have to maintain this going forward, as I add new features
 * that need different parts from the server.
 * */
export const transformCollectionIntoGames = (
	collection: PromiseType<ReturnType<typeof getUserGameCollection>>,
) => {
	const games: GameWithCollection[] = collection.map((c) => ({
		...c,
		...c.game,
		cover: c.game.cover,
		playlists: c.game.playlists.map((p) => p.playlist),
		genres: c.game.genres.map((g) => g.genre),
	}));

	// validate at runtime
	try {
		games.forEach((g) => gameWithCollectionSchema.parse(g));
		return games;
	} catch (e) {
		console.error("THERE IS AN ERROR HERE");
		if (e instanceof ZodError) {
			console.error(e.flatten());
		} else {
			console.error(e);
		}
		return [];
	}
};
