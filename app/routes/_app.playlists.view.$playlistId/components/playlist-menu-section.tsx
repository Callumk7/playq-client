import { Game, PlaylistWithGames, Tag } from "@/types";
import { PlaylistMenubar } from "./playlist-menubar";
import { GuestMenubar } from "./guest-menubar";
import { Button } from "@/components";

interface PlaylistMenuSectionProps {
	playlistWithGames: PlaylistWithGames;
	isCreator: boolean;
	userCollection: Game[];
  setRenameDialogOpen: (state: boolean) => void;
  setDeletePlaylistDialogOpen: (state: boolean) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  allTags: Tag[];
  userId: string;
	userFollowAndRatingData: {
		isFollowing: boolean;
		rating: number | null;
	};
 }

export function PlaylistMenuSection({
	playlistWithGames,
	isCreator,
  userCollection,
  setRenameDialogOpen,
  setDeletePlaylistDialogOpen,
  isEditing,
  setIsEditing,
  allTags,
  userId,
  userFollowAndRatingData,
}: PlaylistMenuSectionProps) {
	return (
		<div className="flex gap-7">
			{isCreator ? (
				<PlaylistMenubar
					isPrivate={playlistWithGames.isPrivate}
					userCollection={userCollection}
					playlistGames={playlistWithGames.games.map((game) => game.gameId)}
					playlistId={playlistWithGames.id}
					userId={playlistWithGames.creatorId}
					setRenameDialogOpen={setRenameDialogOpen}
					setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					tags={allTags}
				/>
			) : (
				<GuestMenubar
					playlistId={playlistWithGames.id}
					userId={userId}
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
