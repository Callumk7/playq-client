import {
	Button,
	Card,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TagArray,
} from "@/components";
import { PlaylistProgress } from "@/routes/res.playlist-sidebar.$userId";
import { PlaylistWithPinned } from "@/types";
import { Link } from "@remix-run/react";
import { usePlaylistData } from "../route";
import { Pencil1Icon, SewingPinIcon, TrashIcon } from "@radix-ui/react-icons";

interface PlaylistTableProps {
	setRenameDialogOpen: (isOpen: boolean) => void;
	setDeletePlaylistDialogOpen: (isOpen: boolean) => void;
	setPlaylistToEdit: (playlist: string) => void;
}

export function PlaylistTable({
	setRenameDialogOpen,
	setDeletePlaylistDialogOpen,
	setPlaylistToEdit,
}: PlaylistTableProps) {
	const { allPlaylists, session } = usePlaylistData();
	return (
		<Card className="mt-10">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Creator</TableHead>
						<TableHead>Games</TableHead>
						<TableHead>Tags</TableHead>
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
								<TagArray tags={playlist.tags.map((tag) => tag.tag.name)} />
							</TableCell>
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
									isCreator={playlist.creatorId === session.user.id}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}

interface PlaylistOptionsProps {
	playlist: PlaylistWithPinned;
	isCreator: boolean;
	setRenameDialogOpen: (renameDialogOpen: boolean) => void;
	setDeletePlaylistDialogOpen: (deletePlaylistDialogOpen: boolean) => void;
	setPlaylistToEdit: (playlistToEdit: string) => void;
}
export function PlaylistOptions({
	playlist,
	isCreator,
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
			{isCreator && (
				<>
					<Button variant={"outline"} size={"icon"} onClick={handleDelete}>
						<TrashIcon />
					</Button>
					<Button variant={"outline"} size={"icon"} onClick={handleEdit}>
						<Pencil1Icon />
					</Button>
				</>
			)}
			<Button variant={playlist.pinned ? "default" : "outline"} size={"icon"}>
				<SewingPinIcon />
			</Button>
		</div>
	);
}
