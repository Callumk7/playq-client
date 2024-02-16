import {
	Button,
	CollectionGameMenu,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	RemoveFromCollectionButton,
	SaveToCollectionButton,
} from "@/components";
import { GameWithCollection } from "@/types";
import { HamburgerMenuIcon, MixIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";

interface PlaylistEntryControlsProps {
	game: GameWithCollection;
	inCollection: boolean;
	userId: string;
	isEditing: boolean;
}
export function PlaylistEntryControls({
	game,
	inCollection,
	userId,
	isEditing,
}: PlaylistEntryControlsProps) {
	return (
		<div className="flex gap-2">
			{inCollection ? (
				<div>You have this one</div>
			) : (
				<SaveToCollectionButton gameId={game.gameId} userId={userId} />
			)}
			{isEditing && (
				<Button variant={"destructive"} size={"icon"}>
					<TrashIcon />
				</Button>
			)}
		</div>
	);
}
