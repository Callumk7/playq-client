import {
	Card,
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Button,
} from "@/components";
import { createServerClient, getSession } from "@/services";
import { getCreatedAndFollowedPlaylists } from "@/features/playlists/lib/get-user-playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";
import {
	HamburgerMenuIcon,
	Pencil1Icon,
	PlusIcon,
	SewingPinIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { CreatePlaylistDialog } from "@/features/playlists";
import { useState } from "react";
import { Link } from "@remix-run/react";
import { PlaylistProgress } from "../res.playlist-sidebar.$userId";
import { Playlist } from "@/types";
import { RenamePlaylistDialog } from "../_app.playlists.view.$playlistId/components/rename-playlist-dialog";
import { DeletePlaylistDialog } from "../_app.playlists.view.$playlistId/components/delete-playlist-dialog";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const allPlaylists = await getCreatedAndFollowedPlaylists(session.user.id);

	return typedjson({ allPlaylists, session });
};

export default function PlaylistView() {
	const { allPlaylists, session } = useTypedLoaderData<typeof loader>();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
	const [deletePlaylistDialogOpen, setDeletePlaylistDialogOpen] =
		useState<boolean>(false);
	const [playlistToEdit, setPlaylistToEdit] = useState<string>("");

	return (
		<>
			<main className="mt-10">
				<div className="mt-5 flex gap-5">
					<Button onClick={() => setDialogOpen(true)} variant={"outline"} size={"sm"}>
						<span className="mr-3">Create new</span>
						<PlusIcon />
					</Button>
					<Button size={"sm"} variant={"outline"}>
						<HamburgerMenuIcon />
					</Button>
				</div>
				<div className="mt-7">
					<Card>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Creator</TableHead>
									<TableHead>Games</TableHead>
									<TableHead>Progress</TableHead>
									<TableHead>Options</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{allPlaylists.map((playlist) => (
									<TableRow key={playlist.id}>
										<TableCell className="font-semibold">
											<Link to={`/playlists/view/${playlist.id}`}>{playlist.name}</Link>
										</TableCell>
										<TableCell>{playlist.creator.username}</TableCell>
										<TableCell>{playlist.games.length}</TableCell>
										<TableCell>
											<PlaylistProgress
												userId={session.user.id}
												playlistId={playlist.id}
												max={playlist.games.length}
											/>
										</TableCell>
										<TableCell>
											<PlaylistOptions
												playlist={playlist}
												setRenameDialogOpen={setRenameDialogOpen}
												setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
												setPlaylistToEdit={setPlaylistToEdit}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</div>
			</main>
			<CreatePlaylistDialog
				userId={session.user.id}
				dialogOpen={dialogOpen}
				setDialogOpen={setDialogOpen}
			/>
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

interface PlaylistOptionsProps {
	playlist: Playlist;
	setRenameDialogOpen: (renameDialogOpen: boolean) => void;
	setDeletePlaylistDialogOpen: (deletePlaylistDialogOpen: boolean) => void;
	setPlaylistToEdit: (playlistToEdit: string) => void;
}

export function PlaylistOptions({
	playlist,
	setRenameDialogOpen,
	setDeletePlaylistDialogOpen,
	setPlaylistToEdit,
}: PlaylistOptionsProps) {
	const handleDelete = () => {
		setPlaylistToEdit(playlist.id);
		setDeletePlaylistDialogOpen(true);
	};

	const handleEdit = () => {
		setPlaylistToEdit(playlist.id);
		setRenameDialogOpen(true);
	};

	return (
		<div className="flex gap-3">
			<Button variant={"outline"} size={"icon"} onClick={handleDelete}>
				<TrashIcon />
			</Button>
			<Button variant={"outline"} size={"icon"} onClick={handleEdit}>
				<Pencil1Icon />
			</Button>
			<Button variant={"outline"} size={"icon"}>
				<SewingPinIcon />
			</Button>
		</div>
	);
}
