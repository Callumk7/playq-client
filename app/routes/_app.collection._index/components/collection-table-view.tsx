import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	CollectionGameMenu,
} from "@/components";
import { useFilterStore } from "@/store/filters";
import { GameWithCollection, Playlist } from "@/types";
import { CheckIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

interface CollectionTableViewProps {
	sortedGames: GameWithCollection[];
	userPlaylists: Playlist[];
	userId: string;
	handleOpenRateGameDialog: (gameId: number) => void;
}

export function CollectionTableView({
	sortedGames,
	userPlaylists,
	userId,
	handleOpenRateGameDialog,
}: CollectionTableViewProps) {
	const store = useFilterStore();
	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead
							onClick={() => store.handleToggleSortName()}
							className="cursor-pointer"
						>
							Title
						</TableHead>
						<TableHead
							className="cursor-pointer"
							onClick={() => store.handleToggleSortRating()}
						>
							Rating
						</TableHead>
						<TableHead
							className="cursor-pointer"
							onClick={() => store.handleToggleSortAggRatingCount()}
						>
							Rating Count
						</TableHead>
						<TableHead
							className="cursor-pointer"
							onClick={() => store.handleTogglePlayerRating()}
						>
							Your Rating
						</TableHead>
						<TableHead>Played?</TableHead>
						<TableHead>Completed?</TableHead>
						<TableHead
							className="cursor-pointer"
							onClick={() => store.handleToggleSortFollows()}
						>
							Followers
						</TableHead>
						<TableHead
							className="cursor-pointer"
							onClick={() => store.handleToggleSortReleaseDate()}
						>
							Release Date
						</TableHead>
						<TableHead
							className="cursor-pointer"
							onClick={() => store.handleToggleSortDateAdded()}
						>
							Date Saved
						</TableHead>
						<TableHead>Menu</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedGames.map((game) => (
						<TableRow key={game.id}>
							<TableCell className="font-semibold">
								<Link to={`/collection/${game.gameId}`}>{game.title}</Link>
							</TableCell>
							<TableCell>{game.rating}</TableCell>
							<TableCell>{game.aggregatedRatingCount}</TableCell>
							<TableCell>{game.playerRating}</TableCell>
							<TableCell>{game.played && <CheckIcon />}</TableCell>
							<TableCell>{game.completed && <CheckIcon />}</TableCell>
							<TableCell>{game.externalFollows}</TableCell>
							<TableCell>
								{game.firstReleaseDate ? game.firstReleaseDate.toDateString() : "unknown"}
							</TableCell>
							<TableCell>{game.createdAt.toDateString()}</TableCell>
							<TableCell>
								<CollectionGameMenu
									gameId={game.gameId}
									isPlayed={game.played}
									isCompleted={game.completed ?? false}
									userId={userId}
									playlists={userPlaylists}
									gamePlaylists={game.playlists}
									handleOpenRateGameDialog={handleOpenRateGameDialog}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
