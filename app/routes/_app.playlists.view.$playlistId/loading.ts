import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const getMinimumPlaylistData = async (playlistId: string) => {
const minimumPlaylistData = await db
	.select({
		creator: playlists.creatorId,
		isPrivate: playlists.isPrivate,
	})
	.from(playlists)
	.where(eq(playlists.id, playlistId));

	return minimumPlaylistData;
}

export const getPlaylistWithGamesAndFollowers = async (playlistId: string) => {
	const playlistWithGames = await db.query.playlists.findFirst({
		where: eq(playlists.id, playlistId),
		with: {
			games: {
				with: {
					game: {
						with: {
							cover: true,
						},
					},
				},
			},
			followers: {
				columns: {
					userId: true
				}
			}
		},
	});

	return playlistWithGames;
};
