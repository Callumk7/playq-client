import { Follower } from "@/types";
import { db } from "db";
import { notes } from "db/schema/notes";
import { followers, playlists } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";

export const getMinimumPlaylistData = async (playlistId: string) => {
	const minimumPlaylistData = await db
		.select({
			creator: playlists.creatorId,
			isPrivate: playlists.isPrivate,
		})
		.from(playlists)
		.where(eq(playlists.id, playlistId));

	return minimumPlaylistData;
};

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
					userId: true,
				},
			},
		},
	});

	return playlistWithGames;
};

export const getPlaylistComments = async (playlistId: string) => {
	const plComments = await db.query.notes.findMany({
		where: and(eq(notes.location, "playlist"), eq(notes.playlistId, playlistId)),
		with: {
			author: true,
		},
	});

	return plComments;
};

export const getUserFollowAndRatingData = async (
	userId: string,
	playlistId: string,
): Promise<{ isFollowing: boolean; rating: number | null }> => {
	const followedPlaylists = await db
		.select()
		.from(followers)
		.where(and(eq(followers.userId, userId), eq(followers.playlistId, playlistId)));

	if (followedPlaylists.length > 0) {
		return {
			isFollowing: true,
			rating: followedPlaylists[0].rating,
		};
	}

	return {
		isFollowing: false,
		rating: null,
	};
};
