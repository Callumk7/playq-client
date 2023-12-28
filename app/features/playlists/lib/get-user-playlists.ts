import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const getUserPlaylists = async (userId: string) => {
	const userPlaylists = await db.query.playlists.findMany({
		where: eq(playlists.creatorId, userId),
	});

	return userPlaylists;
};
