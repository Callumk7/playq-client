import { PlaylistMenubar } from "./playlist-menubar";
import { GuestMenubar } from "./guest-menubar";
import { Button, useDeletePlaylistDialogOpen } from "@/components";
import { usePlaylistViewData } from "../route";

export function PlaylistMenuSection() {
	const { setDeletePlaylistDialogOpen } = useDeletePlaylistDialogOpen();
	const { playlistWithGames, session, isCreator, userFollowAndRatingData } =
		usePlaylistViewData();

	return (
		<div className="flex gap-7">
			{isCreator ? (
				<PlaylistMenubar
					isPrivate={playlistWithGames.isPrivate}
					playlistId={playlistWithGames.id}
					setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
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
