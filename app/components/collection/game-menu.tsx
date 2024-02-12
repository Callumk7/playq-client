import {
	Button,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
} from "@/components";
import { Playlist } from "@/types/playlists";
import {
	HamburgerMenuIcon,
	MixIcon,
	PlusIcon,
	StarFilledIcon,
	StarIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface CollectionGameMenuProps {
	gameId: number;
	isPlayed: boolean;
	isCompleted: boolean;
	userId: string;
	playlists: Playlist[];
	gamePlaylists?: Playlist[];
	handleOpenRateGameDialog: (gameId: number) => void;
}

export function CollectionGameMenu({
	gameId,
	isPlayed,
	isCompleted,
	userId,
	playlists,
	gamePlaylists,
	handleOpenRateGameDialog,
}: CollectionGameMenuProps) {
	const deleteFetcher = useFetcher();
	const playedFetcher = useFetcher();
	const completedFetcher = useFetcher();
	const handleRemove = () => {
		deleteFetcher.submit(
			{
				gameId,
				userId,
			},
			{
				method: "delete",
				action: "/api/collections",
			},
		);
	};

	const handleMarkAsPlayed = () => {
		playedFetcher.submit(
			{
				gameId,
				played: true,
			},
			{
				method: "put",
				action: `/api/collections/${userId}`,
			},
		);
	};

	const handleMarkAsCompleted = () => {
		completedFetcher.submit(
			{
				gameId,
				completed: true,
			},
			{
				method: "put",
				action: `/api/collections/${userId}`,
			},
		);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"outline"} size={"icon"}>
					<HamburgerMenuIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<PlusIcon className="mr-2" />
						<span>Add to playlist</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{playlists.map((playlist) => (
							<PlaylistSubMenuItem
								key={playlist.id}
								playlist={playlist}
								gameId={gameId}
								userId={userId}
								gamePlaylists={gamePlaylists}
							/>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuItem onClick={() => handleOpenRateGameDialog(gameId)}>
					<MixIcon className="mr-2" />
					<span>Rate game</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleMarkAsPlayed}>
					{isPlayed ? (
						<StarFilledIcon className="mr-2 text-primary" />
					) : (
						<StarIcon className="mr-2" />
					)}
					<span>Mark as played</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleMarkAsCompleted}>
					{isCompleted ? (
						<StarFilledIcon className="mr-2 text-primary" />
					) : (
						<StarIcon className="mr-2" />
					)}
					<span>Mark as completed</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleRemove}>
					<TrashIcon className="mr-2" />
					<span>Remove from collection</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface PlaylistSubMenuItemProps {
	playlist: Playlist;
	gameId: number;
	userId: string;
	gamePlaylists?: Playlist[];
}

function PlaylistSubMenuItem({
	playlist,
	gameId,
	userId,
	gamePlaylists,
}: PlaylistSubMenuItemProps) {
	const addToPlaylistFetcher = useFetcher();

	// This was just trying to validate the input, but it is kind of stupid
	// because the submit method has no validation.
	const gameInsert = {
		addedBy: userId,
	};

	return (
		<DropdownMenuCheckboxItem
			key={playlist.id}
			checked={gamePlaylists?.some((p) => p.id === playlist.id)}
			onCheckedChange={(checked) => {
				if (checked) {
					addToPlaylistFetcher.submit(gameInsert, {
						method: "POST",
						action: `/api/playlists/${playlist.id}/games/${gameId}`,
					});
				} else {
					addToPlaylistFetcher.submit(
						{ gameId },
						{
							method: "DELETE",
							action: `/api/playlists/${playlist.id}/games/${gameId}`,
						},
					);
				}
			}}
		>
			{playlist.name}
		</DropdownMenuCheckboxItem>
	);
}
