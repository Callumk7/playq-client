import { Separator } from "@/components/ui/separator";
import { SearchEntryControls } from "@/features/explore";
import { GameWithCover } from "@/types/games";
import { IGDBGame } from "@/types/igdb";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";

interface GameListItemProps {
	game: IGDBGame;
	gameTitle: string;
	gameId: number;
	userId: string;
}

export function GameListItem({ gameTitle, game, gameId, userId }: GameListItemProps) {
	return (
		<div>
			<div className="flex relative flex-row justify-between items-center p-3 w-full rounded-md hover:bg-accent/60">
				<div className="flex flex-row space-x-2">
					<DragHandleDots1Icon className="w-6 h-6" />
					<p className="font-bold cursor-pointer text-foreground">{gameTitle}</p>
				</div>
				<SearchEntryControls
					gameId={gameId}
					userId={userId}
					isSaved={game.saved}
					className="mt-3"
				/>
			</div>
			<Separator />
		</div>
	);
}

interface GameIsSaved extends GameWithCover {
	saved: boolean;
}

interface GameListItemInternalProps {
	game: GameIsSaved;
	userId: string;
}
export function GameListItemInternal({ game, userId }: GameListItemInternalProps) {
	return (
		<div>
			<div className="flex relative flex-row justify-between items-center p-3 w-full rounded-md hover:bg-accent/60">
				<div className="flex flex-row space-x-4">
					<DragHandleDots1Icon className="w-6 h-6" />
					<p className="font-bold cursor-pointer text-foreground">{game.title}</p>
				</div>
				<SearchEntryControls
					gameId={game.gameId}
					userId={userId}
					isSaved={game.saved}
					className="mt-3"
				/>
			</div>
			<Separator />
		</div>
	);
}
