import { Button, GameCover, LibraryView, Separator, Comment, useFilter, useSearch, useSort, useFilterForPlaylists } from "@/components";
import { PlaylistEntryControls } from "./playlist-entry-controls";
import { usePlaylistViewData } from "../route";
import { LibraryViewWithSidebar } from "@/components/collection/library-view-with-sidebar";
import { FollowerSidebar } from "./followers-sidebar";
import { StatsSidebar } from "@/routes/res.playlist-sidebar.$userId";
import { usePlaylistViewStore } from "@/store/playlist-view";
import { PlaylistCommentForm } from "./pl-comment-form";

export function PlaylistView() {
	const { playlistWithGames, userCollection, session, transformedGames, playlistComments } =
		usePlaylistViewData();
	const userCollectionGameIds = userCollection.map((c) => c.gameId);

	const store = usePlaylistViewStore();

	const { filteredGames } = useFilterForPlaylists(transformedGames, store);
	const { searchedGames } = useSearch(filteredGames, store.searchTerm);

	return (
		<>
			<LibraryViewWithSidebar
				sidebar={
					<>
						<StatsSidebar
							userId={session.user.id}
							playlistId={playlistWithGames.id}
							max={playlistWithGames.games.length}
							followerCount={playlistWithGames.followers.length}
						/>
						<FollowerSidebar />
					</>
				}
			>
				<LibraryView>
					{searchedGames.map((game) => (
						<div key={game.id} className="flex flex-col gap-2">
							<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
							<PlaylistEntryControls
								inCollection={userCollectionGameIds.includes(game.gameId)}
								gameId={game.gameId}
								userId={session.user.id}
								isEditing={store.isEditing}
							/>
						</div>
					))}
				</LibraryView>
				<Separator className="mt-10" />
				<div className="flex gap-5 items-center">
					<h2 className="text-2xl font-semibold">Comments</h2>
					<Button
						variant={"outline"}
						size={"sm"}
						onClick={() => store.setIsCommenting(!store.isCommenting)}
					>
						{store.isCommenting ? "Hide" : "Post a Comment"}
					</Button>
				</div>
				{store.isCommenting && (
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
		</>
	);
}
