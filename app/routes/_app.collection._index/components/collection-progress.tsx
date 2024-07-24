import { Label, Progress } from "@/components";

export function CollectionProgress({
	gameCount,
	playedGames,
	completedGames,
}: {
	gameCount: number;
	playedGames: number;
	completedGames: number;
}) {
	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex flex-col gap-2">
				<Label>Played</Label>
				<Progress value={playedGames} max={gameCount} className="h-2" />
			</div>
			<div className="flex flex-col gap-2">
				<Label>Completed</Label>
				<Progress value={completedGames} max={gameCount} className="h-2" />
			</div>
		</div>
	);
}
