import {
	Button,
	Comment,
	DeletePlaylistDialog,
	RenamePlaylistDialog,
	Separator,
	useDeletePlaylistDialogOpen,
} from "@/components";
import { getUserCollection } from "@/model";
import { authenticate } from "@/services";
import { Game } from "@/types/games";
import { NoteWithAuthor } from "@/types/notes";
import { PlaylistWithGames } from "@/types/playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Session } from "@supabase/supabase-js";
import { ReactNode, useEffect, useState } from "react";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { StatsSidebar } from "../res.playlist-sidebar.$userId";
import { FollowerSidebar } from "./components/followers-sidebar";
import { PlaylistCommentForm } from "./components/pl-comment-form";
import {
	getAggregatedPlaylistRating,
	getMinimumPlaylistData,
	getPlaylistComments,
	getPlaylistWithGamesAndFollowers,
	getUserFollowAndRatingData,
} from "./queries.server";
import { PlaylistMenuSection } from "./components/playlist-menu-section";
import { PlaylistView } from "./components/playlist-view";

// Type guard types. We can block users by returning "blocked" from the loader.
// As such, if we want type safety, we need to define the types first and narrow.
interface Blocked {
	blocked: true;
}

interface Result {
	blocked: false;
	playlistWithGames: PlaylistWithGames & {
		followers: { userId: string }[];
	};
	userCollection: Game[];
	isCreator: boolean;
	userFollowAndRatingData: {
		isFollowing: boolean;
		rating: number | null;
	};
	session: Session;
	playlistComments: NoteWithAuthor[];
	aggregatedRating: { id: string; aggRating: number; count: number };
}

///
/// LOADER
///
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const session = await authenticate(request);

	const { playlistId } = zx.parseParams(params, {
		playlistId: z.string(),
	});

	const minPlaylistData = await getMinimumPlaylistData(playlistId); // minimum to decide permissions

	// if creator != user & isPrivate
	if (minPlaylistData[0].creator !== session.user.id && minPlaylistData[0].isPrivate) {
		return typedjson({ blocked: true });
	}

	const playlistCommentsPromise = getPlaylistComments(playlistId);
	const playlistWithGamesPromise = getPlaylistWithGamesAndFollowers(playlistId);
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

	const isCreator = playlistWithGames!.creatorId === session.user.id;

	return typedjson({
		playlistWithGames,
		userCollection,
		blocked: false,
		isCreator,
		userFollowAndRatingData,
		playlistComments,
		session,
		aggregatedRating,
	});
};

///
/// ROUTE
///
export default function PlaylistRoute() {
	const result = useTypedLoaderData<Blocked | Result>();
	const rename = useFetcher();
	const isSubmitting = rename.state === "submitting";

	const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
	const { deletePlaylistDialogOpen, setDeletePlaylistDialogOpen } =
		useDeletePlaylistDialogOpen();

	const [isCommenting, setIsCommenting] = useState<boolean>(false);

	const [isEditing, setIsEditing] = useState<boolean>(false);

	// This should not be required.
	useEffect(() => {
		if (isSubmitting && renameDialogOpen) {
			setRenameDialogOpen(false);
		}
	}, [isSubmitting, renameDialogOpen]);

	if (result.blocked) {
		return <div>This Playlist is Private</div>;
	}

	const {
		playlistWithGames,
		userCollection,
		isCreator,
		session,
		playlistComments,
		userFollowAndRatingData,
		aggregatedRating,
	} = result;

	return (
		<>
			<div className="flex flex-col gap-6">
				<PlaylistMenuSection
					playlistWithGames={playlistWithGames}
					isCreator={isCreator}
					userCollection={userCollection}
					setRenameDialogOpen={setRenameDialogOpen}
					setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					userId={session.user.id}
					userFollowAndRatingData={userFollowAndRatingData}
				/>
				<PlaylistTitle title={playlistWithGames.name} />
				<LibraryViewWithSidebar
					sidebar={
						<>
							<StatsSidebar
								userId={session.user.id}
								playlistId={playlistWithGames.id}
								max={playlistWithGames.games.length}
								followerCount={playlistWithGames.followers.length}
							/>
							<FollowerSidebar
								followers={aggregatedRating.count}
								rating={Math.floor(aggregatedRating.aggRating)}
							/>
						</>
					}
				>
					<PlaylistView isEditing={isEditing} />
					<Separator className="mt-10" />
					<div className="flex gap-5 items-center">
						<h2 className="text-2xl font-semibold">Comments</h2>
						<Button
							variant={"outline"}
							size={"sm"}
							onClick={() => setIsCommenting(!isCommenting)}
						>
							{isCommenting ? "Hide" : "Post a Comment"}
						</Button>
					</div>
					{isCommenting && (
						<PlaylistCommentForm
							userId={session.user.id}
							playlistId={playlistWithGames.id}
						/>
					)}
					<div className="grid gap-3">
						{playlistComments.map((comment) => (
							<Comment key={comment.id} comment={comment} author={comment.author} />
						))}
					</div>
				</LibraryViewWithSidebar>
			</div>
			<RenamePlaylistDialog
				renameDialogOpen={renameDialogOpen}
				setRenameDialogOpen={setRenameDialogOpen}
				playlistId={playlistWithGames.id}
			/>
			<DeletePlaylistDialog
				deletePlaylistDialogOpen={deletePlaylistDialogOpen}
				setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
				playlistId={playlistWithGames.id}
			/>
		</>
	);
}

function PlaylistTitle({ title }: { title: string }) {
	return (
		<>
			<h1 className="py-2 mt-5 text-3xl font-semibold">{title}</h1>
			<Separator />
		</>
	);
}

function LibraryViewWithSidebar({
	children,
	sidebar,
}: { children: ReactNode; sidebar: ReactNode }) {
	return (
		<div className="grid relative gap-10 lg:grid-cols-12">
			<div className="flex flex-col gap-5 lg:col-span-9">{children}</div>
			<div className="relative lg:col-span-3">
				<div className="flex flex-col gap-8 h-full">{sidebar}</div>
			</div>
		</div>
	);
}

export const usePlaylistViewData = () => {
	const data = useTypedRouteLoaderData<Blocked | Result>(
		"routes/_app.playlists.view.$playlistId",
	);
	if (data === undefined) {
		throw new Error(
			"usePlaylistViewData must be used within the _app.playlists.view.$playlistId route or its children",
		);
	}

	return data;
};
