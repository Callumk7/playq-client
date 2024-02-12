import {
	Button,
	GameCover,
	LibraryView,
	RemoveFromCollectionButton,
	SaveToCollectionButton,
	Separator,
} from "@/components";
import { getUserCollection } from "@/model";
import { createServerClient, getSession } from "@/services";
import { useUserCacheStore } from "@/store/collection";
import { Game } from "@/types/games";
import { PlaylistCommentsWithAuthor, PlaylistWithGames } from "@/types/playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { StatsSidebar } from "../res.playlist-sidebar.$userId";
import { DeletePlaylistDialog } from "./components/delete-playlist-dialog";
import { Comment } from "./components/pl-comment";
import { PlaylistCommentForm } from "./components/pl-comment-form";
import { PlaylistMenubar } from "./components/playlist-menubar";
import { RenamePlaylistDialog } from "./components/rename-playlist-dialog";
import {
	getMinimumPlaylistData,
	getPlaylistComments,
	getPlaylistWithGamesAndFollowers,
} from "./loading";

// Type guard types
interface Blocked {
	blocked: true;
}

interface Result {
	blocked: false;
	playlistWithGames: PlaylistWithGames & {
		followers: { userId: string }[];
	};
	usersGames: Game[];
	isCreator: boolean;
	session: Session;
	playlistComments: PlaylistCommentsWithAuthor[];
}

///
/// LOADER
///
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

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

	const [playlistWithGames, userCollection, playlistComments] = await Promise.all([
		playlistWithGamesPromise,
		userCollectionPromise,
		playlistCommentsPromise,
	]);

	const usersGames = userCollection.map((c) => c.game);
	const isCreator = playlistWithGames!.creatorId === session.user.id;

	return typedjson({
		playlistWithGames,
		usersGames,
		blocked: false,
		isCreator,
		playlistComments,
		session,
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
	const [deletePlaylistDialogOpen, setDeletePlaylistDialogOpen] =
		useState<boolean>(false);

	// zustand store. We use these Ids to check to see if the game already
	// exists in the user's collection.
	const userCollection = useUserCacheStore((state) => state.userCollection);

	useEffect(() => {
		if (isSubmitting && renameDialogOpen) {
			setRenameDialogOpen(false);
		}
	}, [isSubmitting, renameDialogOpen]);

	if (result.blocked) {
		return <div>This Playlist is Private</div>;
	}

	const { playlistWithGames, usersGames, isCreator, session, playlistComments } = result;

	return (
		<>
			<div className="flex flex-col gap-6">
				<div className="flex gap-7">
					{isCreator && (
						<PlaylistMenubar
							isPrivate={playlistWithGames.isPrivate}
							games={usersGames}
							playlistId={playlistWithGames.id}
							userId={playlistWithGames.creatorId}
							setRenameDialogOpen={setRenameDialogOpen}
							setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
						/>
					)}
					{playlistWithGames?.isPrivate && (
						<Button disabled variant={"outline"} size={"sm"}>
							is private
						</Button>
					)}
				</div>
				<h1 className="mt-5 py-2 text-3xl font-semibold">{playlistWithGames?.name}</h1>
				<Separator />
				<div className="relative grid grid-cols-12 gap-10">
					<div className="col-span-9 flex flex-col gap-5">
						<LibraryView>
							{playlistWithGames?.games.map((game) => (
								<div key={game.game.id} className="flex flex-col gap-2">
									<GameCover coverId={game.game.cover.imageId} gameId={game.gameId} />
									{userCollection.includes(game.gameId) ? (
										<RemoveFromCollectionButton
											gameId={game.gameId}
											userId={session.user.id}
										/>
									) : (
										<SaveToCollectionButton
											gameId={game.gameId}
											userId={session.user.id}
										/>
									)}
								</div>
							))}
						</LibraryView>
						<Separator className="mt-10" />
						<h2 className="text-2xl font-semibold">Comments</h2>
						<PlaylistCommentForm
							userId={session.user.id}
							playlistId={playlistWithGames.id}
						/>
						<div className="grid gap-3">
							{playlistComments.map((comment) => (
								<Comment key={comment.id} comment={comment} author={comment.author} />
							))}
						</div>
					</div>
					<div className="relative col-span-3">
						<StatsSidebar
							userId={session.user.id}
							playlistId={playlistWithGames.id}
							max={playlistWithGames.games.length}
							followerCount={playlistWithGames.followers.length}
						/>
					</div>
				</div>
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
