import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { Game } from "@/types/games";
import { useFetcher } from "@remix-run/react";

interface PlaylistMenubarProps {
	isPrivate: boolean;
	games: Game[];
	playlistId: string;
	userId: string;
	setRenameDialogOpen: (renameDialogOpen: boolean) => void;
	setDeletePlaylistDialogOpen: (deletePlaylistDialogOpen: boolean) => void;
}

export function PlaylistMenubar({
	isPrivate,
	games,
	playlistId,
	userId,
	setRenameDialogOpen,
	setDeletePlaylistDialogOpen,
}: PlaylistMenubarProps) {
	const addGameFetcher = useFetcher();
	const markAsPrivateFetcher = useFetcher();

	const handleTogglePrivate = () => {
		markAsPrivateFetcher.submit(
			{ isPrivate: !isPrivate },
			{ action: `/api/playlists/${playlistId}`, method: "PATCH" },
		);
	};
	return (
		<div className="flex justify-between">
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
				<MenubarMenu>
					<MenubarTrigger>Add Games</MenubarTrigger>
					<MenubarContent>
						{games.map((game) => (
							<MenubarItem
								key={game.id}
								onClick={() =>
									addGameFetcher.submit(
										{
											addedBy: userId,
										},
										{
											action: `/api/playlists/${playlistId}/games/${game.gameId}`,
											method: "POST",
										},
									)
								}
							>
								{game.title}
							</MenubarItem>
						))}
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</div>
	);
}
