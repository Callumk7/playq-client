import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const getPlaylistWithGames = async (playlistId: string) => {
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
		},
	});

	return playlistWithGames;
};
