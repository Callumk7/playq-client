import {
	Button,
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components";
import { Game } from "@/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { usePlaylistViewStore } from "@/store/playlist-view";

interface PlaylistMenubarProps {
	isPrivate: boolean;
	userCollection: Game[];
	playlistId: string;
	playlistGames: number[];
	userId: string;
	setRenameDialogOpen: (renameDialogOpen: boolean) => void;
	setDeletePlaylistDialogOpen: (deletePlaylistDialogOpen: boolean) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}

export function PlaylistMenubar({
	isPrivate,
	playlistId,
	setDeletePlaylistDialogOpen,
}: PlaylistMenubarProps) {
	const markAsPrivateFetcher = useFetcher();
	const store = usePlaylistViewStore();

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
						<MenubarItem onClick={() => store.setRenameDialogOpen(true)}>
							Rename
						</MenubarItem>
						<MenubarItem onClick={handleTogglePrivate}>
							{isPrivate ? "Make Public" : "Set as Private"}
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
			<Button
				variant={store.isEditing ? "default" : "outline"}
				onClick={() => store.setIsEditing(!store.isEditing)}
			>
				Edit
			</Button>
			<Button
				variant={"outline"}
				aria-label="Add games button"
				onClick={() => store.setAddGameDialogOpen(true)}
			>
				<PlusCircledIcon className="mr-3" aria-hidden="true" />
				<span>Add Games</span>
			</Button>
		</div>
	);
}
