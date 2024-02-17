import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
	ScrollArea,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { Game } from "@/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface PlaylistMenubarProps {
	isPrivate: boolean;
	games: Game[];
	playlistId: string;
	userId: string;
	setRenameDialogOpen: (renameDialogOpen: boolean) => void;
	setDeletePlaylistDialogOpen: (deletePlaylistDialogOpen: boolean) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}

export function PlaylistMenubar({
	isPrivate,
	games,
	playlistId,
	userId,
	setRenameDialogOpen,
	setDeletePlaylistDialogOpen,
	isEditing,
	setIsEditing,
}: PlaylistMenubarProps) {
	const markAsPrivateFetcher = useFetcher();

	const handleTogglePrivate = () => {
		markAsPrivateFetcher.submit(
			{ isPrivate: !isPrivate },
			{ action: `/api/playlists/${playlistId}`, method: "PATCH" },
		);
	};
	return (
		<div className="flex gap-3">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Menu</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={() => setDeletePlaylistDialogOpen(true)}>
							Delete
						</MenubarItem>
						<MenubarItem onClick={() => setRenameDialogOpen(true)}>Rename</MenubarItem>
						<MenubarItem onClick={handleTogglePrivate}>
							{isPrivate ? "Make Public" : "Set as Private"}
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
			<Button
				variant={isEditing ? "default" : "outline"}
				onClick={() => setIsEditing(!isEditing)}
			>
				Edit
			</Button>
			<AddGameToPlaylistDialog games={games} userId={userId} playlistId={playlistId} />
		</div>
	);
}

interface AddGameToPlaylistDialogProps {
	games: Game[];
	userId: string;
	playlistId: string;
}

function AddGameToPlaylistDialog({
	games,
	userId,
	playlistId,
}: AddGameToPlaylistDialogProps) {
	const addGameFetcher = useFetcher();
	return (
		<Dialog aria-label="Add game to playlist dialog">
			<DialogTrigger>
				<Button variant={"outline"} aria-label="Add games button">
					<PlusCircledIcon className="mr-3" aria-hidden="true" />
					<span>Add Games</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<addGameFetcher.Form
					method="POST"
					action={`/api/playlists/${playlistId}/games`}
					aria-labelledby="addGameForm"
				>
					<input type="hidden" name="addedBy" value={userId} />
					<ScrollArea className="h-[50vh] w-full">
						<Table aria-label="Games list">
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Rating</TableHead>
									<TableHead>Select</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{games.map((game) => (
									<AddGameTableRow key={game.id} game={game} />
								))}
							</TableBody>
						</Table>
					</ScrollArea>
					<DialogFooter>
						<Button aria-label="Submit button" type="submit">
							Add
						</Button>
					</DialogFooter>
				</addGameFetcher.Form>
			</DialogContent>
		</Dialog>
	);
}

function AddGameTableRow({ game }: { game: Game }) {
	const [checked, setChecked] = useState(false);
	return (
		<TableRow key={game.id}>
			<TableCell onClick={() => setChecked(!checked)}>{game.title}</TableCell>
			<TableCell>{game.rating ?? 0}</TableCell>
			<TableCell className="flex items-center">
				<Checkbox
					value={game.gameId}
					name="gameIds"
					aria-label={`Select game ${game.title}`}
					checked={checked}
					onCheckedChange={() => setChecked(!checked)}
				/>
			</TableCell>
		</TableRow>
	);
}
