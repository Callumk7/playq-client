import { PlaylistMenubar } from "./playlist-menubar";
import { GuestMenubar } from "./guest-menubar";
import { Button, useDeletePlaylistDialogOpen } from "@/components";
import { usePlaylistViewStore } from "@/store/playlist-view";
import { usePlaylistViewData } from "../route";

export function PlaylistMenuSection() {
	const store = usePlaylistViewStore();
	const { setDeletePlaylistDialogOpen } = useDeletePlaylistDialogOpen();
	const {
		playlistWithGames,
		userCollection,
		session,
    isCreator,
		userFollowAndRatingData,
	} = usePlaylistViewData();

	return (
		<div className="flex gap-7">
			{isCreator ? (
				<PlaylistMenubar
					isPrivate={playlistWithGames.isPrivate}
					userCollection={userCollection}
					playlistGames={playlistWithGames.games.map((game) => game.gameId)}
					playlistId={playlistWithGames.id}
					userId={playlistWithGames.creatorId}
					setRenameDialogOpen={store.setRenameDialogOpen}
					setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
					isEditing={store.isEditing}
					setIsEditing={store.setIsEditing}
				/>
			) : (
				<GuestMenubar
					playlistId={playlistWithGames.id}
					userId={session.user.id}
					isFollowing={userFollowAndRatingData.isFollowing}
					userPlaylistRating={userFollowAndRatingData.rating}
				/>
			)}
			{playlistWithGames?.isPrivate && (
				<Button disabled variant={"outline"} size={"sm"}>
					is private
				</Button>
			)}
		</div>
	);
}
