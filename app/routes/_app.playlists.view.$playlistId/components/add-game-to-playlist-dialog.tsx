import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogFooter,
	ScrollArea,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { usePlaylistViewStore } from "@/store/playlist-view";
import { Game } from "@/types";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface AddGameToPlaylistDialogProps {
	userCollection: Game[];
	playlistGames: number[];
	userId: string;
	playlistId: string;
}

export function AddGameToPlaylistDialog({
	userCollection,
	playlistGames,
	userId,
	playlistId,
}: AddGameToPlaylistDialogProps) {
	const addGameFetcher = useFetcher();
	const store = usePlaylistViewStore();
	return (
		<Dialog
			aria-label="Add game to playlist dialog"
			open={store.addGameDialogOpen}
			onOpenChange={store.setAddGameDialogOpen}
		>
			<DialogContent>
				<addGameFetcher.Form
					method="POST"
					action={`/api/playlists/${playlistId}/games`}
					aria-labelledby="addGameForm"
					onSubmit={() => store.setAddGameDialogOpen(false)}
				>
					<input type="hidden" name="addedBy" value={userId} />
					<ScrollArea className="w-full h-[50vh]">
						<Table aria-label="Games list">
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Rating</TableHead>
									<TableHead>Select</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{userCollection.map((game) => (
									<AddGameTableRow
										key={game.id}
										game={game}
										inPlaylist={playlistGames.includes(game.gameId)}
									/>
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

function AddGameTableRow({ game, inPlaylist }: { game: Game; inPlaylist: boolean }) {
	const [checked, setChecked] = useState(inPlaylist);
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
