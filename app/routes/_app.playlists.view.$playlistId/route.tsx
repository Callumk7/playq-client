import {
	Button,
	Comment,
	DeletePlaylistDialog,
	RenamePlaylistDialog,
	Separator,
	useDeletePlaylistDialogOpen,
} from "@/components";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ReactNode, useState } from "react";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { StatsSidebar } from "../res.playlist-sidebar.$userId";
import { FollowerSidebar } from "./components/followers-sidebar";
import { PlaylistCommentForm } from "./components/pl-comment-form";
import { handlePlaylistRequest } from "./queries.server";
import { PlaylistMenuSection } from "./components/playlist-menu-section";
import { PlaylistView } from "./components/playlist-view";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const data = await handlePlaylistRequest(request, params);
	return typedjson(data);
};

///
/// ROUTE
///
export default function PlaylistRoute() {
	const {
		playlistWithGames,
		userCollection,
		isCreator,
		session,
		playlistComments,
		userFollowAndRatingData,
		aggregatedRating,
	} = useTypedLoaderData<typeof loader>();

  const { deletePlaylistDialogOpen, setDeletePlaylistDialogOpen } =
  useDeletePlaylistDialogOpen();
	const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
	const [isCommenting, setIsCommenting] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	return (
		<>
			<div className="flex flex-col gap-6">
				<PlaylistMenuSection
					playlistWithGames={playlistWithGames!}
					isCreator={isCreator}
					userCollection={userCollection}
					setRenameDialogOpen={setRenameDialogOpen}
					setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					userId={session.user.id}
					userFollowAndRatingData={userFollowAndRatingData}
				/>
				<PlaylistTitle title={playlistWithGames!.name} />
				<LibraryViewWithSidebar
					sidebar={
						<>
							<StatsSidebar
								userId={session.user.id}
								playlistId={playlistWithGames!.id}
								max={playlistWithGames!.games.length}
								followerCount={playlistWithGames!.followers.length}
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
							playlistId={playlistWithGames!.id}
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
				playlistId={playlistWithGames!.id}
			/>
			<DeletePlaylistDialog
				deletePlaylistDialogOpen={deletePlaylistDialogOpen}
				setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
				playlistId={playlistWithGames!.id}
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
	const data = useTypedRouteLoaderData<typeof loader>(
		"routes/_app.playlists.view.$playlistId",
	);
	if (data === undefined) {
		throw new Error(
			"usePlaylistViewData must be used within the _app.playlists.view.$playlistId route or its children",
		);
	}

	return data;
};
