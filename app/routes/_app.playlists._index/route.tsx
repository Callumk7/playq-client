import {
	DeletePlaylistDialog,
	RenamePlaylistDialog,
	usePlaylistDialogOpen,
} from "@/components";
import { authenticate } from "@/services";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { getCreatedAndFollowedPlaylists } from "./loading";
import { PlaylistTable } from "./components/playlist-table";
import { PlaylistMenu } from "./components/playlist-menu";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);

	const allPlaylists = await getCreatedAndFollowedPlaylists(session.user.id);

	return typedjson({ allPlaylists, session });
};

///
/// ROUTE
///
export default function PlaylistView() {
	const { setPlaylistDialogOpen } = usePlaylistDialogOpen();
	const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
	const [deletePlaylistDialogOpen, setDeletePlaylistDialogOpen] =
		useState<boolean>(false);
	const [playlistToEdit, setPlaylistToEdit] = useState<string>("");

	return (
		<>
			<main className="mt-10">
				<PlaylistMenu setPlaylistDialogOpen={setPlaylistDialogOpen} />
        <PlaylistTable
        setRenameDialogOpen={setRenameDialogOpen}
        setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
        setPlaylistToEdit={setPlaylistToEdit}
      />
			</main>
			<RenamePlaylistDialog
				renameDialogOpen={renameDialogOpen}
				setRenameDialogOpen={setRenameDialogOpen}
				playlistId={playlistToEdit}
			/>
			<DeletePlaylistDialog
				deletePlaylistDialogOpen={deletePlaylistDialogOpen}
				setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
				playlistId={playlistToEdit}
			/>
		</>
	);
}

export function usePlaylistData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app.playlists._index");
	if (data === undefined) {
		throw new Error(
			"usePlaylistData must be used within the _app/playlists/index route or its children",
		);
	}
	return data;
}
