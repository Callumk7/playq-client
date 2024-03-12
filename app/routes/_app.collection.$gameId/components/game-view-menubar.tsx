import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components";
import { useCollectionControls } from "@/components/collection/hooks/controls";
import { Playlist, UsersToGames } from "@/types";

interface GameViewMenubarProps {
	userId: string;
	gameId: number;
	userPlaylists: Playlist[];
	collectionDetails: UsersToGames;
}

export function GameViewMenubar({
	userId,
	gameId,
	userPlaylists,
	collectionDetails,
}: GameViewMenubarProps) {
	const { handleRemove, handleMarkAsPlayed, handleMarkAsCompleted } =
		useCollectionControls(
			userId,
			gameId,
			collectionDetails.played,
			collectionDetails.completed,
			collectionDetails.pinned,
		);
	return (
		<Menubar className="w-fit">
			<MenubarMenu>
				<MenubarTrigger>Actions</MenubarTrigger>
				<MenubarContent>
					<MenubarItem onClick={handleRemove}>Remove from collection</MenubarItem>
					<MenubarItem>Rate</MenubarItem>
					<MenubarItem onClick={handleMarkAsPlayed}>Mark as Played</MenubarItem>
					<MenubarItem onClick={handleMarkAsCompleted}>Mark as Completed</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Playlists</MenubarTrigger>
				<MenubarContent>
					<MenubarSub>
						<MenubarSubTrigger>Add to playlist</MenubarSubTrigger>
						<MenubarSubContent>
							{userPlaylists.map((pl) => (
								<MenubarCheckboxItem key={pl.id}>{pl.name}</MenubarCheckboxItem>
							))}
						</MenubarSubContent>
					</MenubarSub>
					<MenubarItem>Find playlists..</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
