import { getUserCollection } from "@/model";
import { authenticate } from "@/services";
import { Params, redirect } from "@remix-run/react";
import { db } from "db";
import { notes } from "db/schema/notes";
import { followers, playlists, tags } from "db/schema/playlists";
import { and, avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

export const handlePlaylistRequest = async (request: Request, params: Params) => {
	const session = await authenticate(request);
	const { playlistId } = zx.parseParams(params, {
		playlistId: z.string(),
	});

	const minPlaylistData = await getMinimumPlaylistData(playlistId); // minimum to decide permissions

	// A private route: We must remove the explorer here.
	if (minPlaylistData[0].creator !== session.user.id && minPlaylistData[0].isPrivate) {
		throw redirect("/playlists/view/blocked");
	}

	const playlistWithGamesPromise = getPlaylistWithGamesAndFollowers(playlistId);
	const playlistCommentsPromise = getPlaylistComments(playlistId);
	const userCollectionPromise = getUserCollection(session.user.id);
	const userFollowAndRatingDataPromise = getUserFollowAndRatingData(
		session.user.id,
		playlistId,
	);
	const aggregatedRatingPromise = getAggregatedPlaylistRating(playlistId);

	const [
		playlistWithGames,
		userCollection,
		playlistComments,
		userFollowAndRatingData,
		aggregatedRating,
	] = await Promise.all([
		playlistWithGamesPromise,
		userCollectionPromise,
		playlistCommentsPromise,
		userFollowAndRatingDataPromise,
		aggregatedRatingPromise,
	]);

	if (!playlistWithGames) {
		throw redirect("/playlists")
	}

	const isCreator = playlistWithGames.creatorId === session.user.id;

	return {
		playlistWithGames,
		userCollection,
		playlistComments,
		userFollowAndRatingData,
		aggregatedRating,
		isCreator,
		session
	};
};

const getMinimumPlaylistData = async (playlistId: string) => {
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

const getAggregatedPlaylistRating = async (playlistId: string) => {
	const queryResult = await db
		.select({
			id: followers.playlistId,
			aggRating: avg(followers.rating),
			count: count(followers.playlistId),
		})
		.from(followers)
		.where(eq(followers.playlistId, playlistId))
		.groupBy(followers.playlistId);

	if (queryResult[0]) {
		return queryResult[0];
	}

	return { id: playlistId, aggRating: "0", count: "0" };
};

export const getAllTags = async () => {
	const allTags = await db.select().from(tags);
	return allTags;
};
