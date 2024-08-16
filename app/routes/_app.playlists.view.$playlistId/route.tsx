import {
	DeletePlaylistDialog,
	RenamePlaylistDialog,
	useDeletePlaylistDialogOpen,
} from "@/components";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData, useTypedRouteLoaderData } from "remix-typedjson";
import { handlePlaylistRequest } from "./queries.server";
import { PlaylistMenuSection } from "./components/playlist-menu-section";
import { PlaylistView } from "./components/playlist-view";
import { usePlaylistViewStore } from "@/store/playlist-view";
import { PlaylistTitle } from "@/components/headers";
import { AddGameToPlaylistDialog } from "./components/add-game-to-playlist-dialog";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const data = await handlePlaylistRequest(request, params);
	return typedjson(data);
};

///
/// ROUTE
///
export default function PlaylistRoute() {
	const { playlistWithGames, userCollection, session } =
		useTypedLoaderData<typeof loader>();

	const { deletePlaylistDialogOpen, setDeletePlaylistDialogOpen } =
		useDeletePlaylistDialogOpen();

	const store = usePlaylistViewStore();

	return (
		<>
			<div className="flex flex-col gap-6">
				<PlaylistMenuSection />
				<PlaylistTitle title={playlistWithGames.name} />
				<PlaylistView />
			</div>
			<AddGameToPlaylistDialog
				userCollection={userCollection}
				playlistId={playlistWithGames.id}
				playlistGames={playlistWithGames.games.map((game) => game.gameId)}
				userId={session.user.id}
			/>
			<RenamePlaylistDialog
				renameDialogOpen={store.renameDialogOpen}
				setRenameDialogOpen={store.setRenameDialogOpen}
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
