import {
	GameWithCollection,
	UserCollectionWithFullDetails,
	gameWithCollectionSchema,
} from "@/types/games";
import { ZodError } from "zod";

export const transformCollectionIntoGames = (
	collection: UserCollectionWithFullDetails[],
) => {
	const games: GameWithCollection[] = collection.map((c) => ({
		...c,
		...c.game,
		cover: c.game.cover,
		playlists: c.game.playlists.map((p) => p.playlist),
		genres: c.game.genres.map((g) => g.genre),
		dateAdded: c.createdAt,
	}));

	// validate at runtime
	try {
		// biome-ignore lint/complexity/noForEach: simple one-liner
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
