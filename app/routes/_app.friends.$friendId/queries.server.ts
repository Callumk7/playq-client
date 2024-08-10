import { PlaylistWithGamesTagsFollows } from "@/types";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { playlists } from "db/schema/playlists";
import { desc, eq } from "drizzle-orm";

export const getFriendsCollection = async (friendId: string, limit = 10) => {
	const gameCollection = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, friendId),
		with: {
			game: {
				with: {
					cover: true,
				},
			},
		},
		limit,
		orderBy: desc(usersToGames.playerRating),
	});

	return gameCollection;
};

export const getFriendsPlaylists = async (
	friendId: string,
	limit = 10,
): Promise<PlaylistWithGamesTagsFollows[]> => {
	const friendPlaylists = await db.query.playlists.findMany({
		where: eq(playlists.creatorId, friendId),
		with: {
			followers: true,
			games: true,
			tags: {
				with: { tag: true },
			},
		},
		limit,
	});

	return friendPlaylists;
};
