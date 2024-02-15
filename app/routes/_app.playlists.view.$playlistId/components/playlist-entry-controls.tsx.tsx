import { Button, RemoveFromCollectionButton, SaveToCollectionButton } from "@/components";
import { TrashIcon } from "@radix-ui/react-icons";

interface PlaylistEntryControlsProps {
	inCollection: boolean;
	gameId: number;
	userId: string;
}
export function PlaylistEntryControls({
	inCollection,
	gameId,
	userId,
}: PlaylistEntryControlsProps) {
	return (
		<div className="flex gap-2">
			{inCollection ? (
				<RemoveFromCollectionButton gameId={gameId} userId={userId} />
			) : (
				<SaveToCollectionButton gameId={gameId} userId={userId} />
			)}
			<Button variant={"destructive"} size={"icon"}>
				<TrashIcon />
			</Button>
		</div>
	);
}
