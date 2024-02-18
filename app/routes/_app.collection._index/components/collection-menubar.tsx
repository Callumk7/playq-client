import {
	Button,
	GameSortAndFilterMenu,
	Input,
	ExternalSearchDialog,
	Toggle,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components";
import { useFilterStore } from "@/store/filters";
import { Playlist } from "@/types";
import { GroupIcon, PlusCircledIcon, TableIcon, TrashIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface CollectionMenubarProps {
	userId: string;
	isTableView: boolean;
	selectMode: boolean;
	selectedGames: number[];
	userPlaylists: Playlist[];
	setSelectMode: (selectMode: boolean) => void;
	setIsTableView: (isTableView: boolean) => void;
}

export function CollectionMenubar({
	userId,
	isTableView,
	selectMode,
	selectedGames,
	userPlaylists,
	setSelectMode,
	setIsTableView,
}: CollectionMenubarProps) {
	const searchTerm = useFilterStore((state) => state.searchTerm);
	const setSearchTerm = useFilterStore((state) => state.setSearchTerm);

	const deleteFetcher = useFetcher();
	const playlistFetcher = useFetcher();

	const handleBulkDelete = () => {
		const formData = new FormData();
		formData.append("userId", userId);
		for (const gameId of selectedGames) {
			formData.append("gameIds", String(gameId));
		}
		deleteFetcher.submit(formData, {
			method: "DELETE",
			action: "/api/collections/bulk",
		});
	};

	const handleBulkAddToPlaylist = (playlistId: string) => {
		const formData = new FormData();
		formData.append("addedBy", userId);
		for (const gameId of selectedGames) {
			formData.append("gameIds", String(gameId));
		}
		playlistFetcher.submit(formData, {
			method: "POST",
			action: `/api/playlists/${playlistId}/games`,
		});
	};

	return (
		<div className="flex justify-between">
			<div className="flex w-full justify-start gap-4">
				<ExternalSearchDialog userId={userId} />
				<GameSortAndFilterMenu />
				<Toggle
					variant={"outline"}
					pressed={isTableView}
					onPressedChange={() => setIsTableView(!isTableView)}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<TableIcon />
						</TooltipTrigger>
						<TooltipContent>{isTableView ? "Grid view" : "Table view"}</TooltipContent>
					</Tooltip>
				</Toggle>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant={"outline"}>
							<GroupIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => setSelectMode(!selectMode)}>
							<GroupIcon className="mr-3" />
							{selectMode ? <span>Cancel Select</span> : <span>Select Mode</span>}
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger disabled={!selectMode}>
								<PlusCircledIcon className="mr-3" />
								<span>Add to playlist..</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{userPlaylists.map((playlist) => (
									<DropdownMenuItem
										key={playlist.id}
										onClick={() => handleBulkAddToPlaylist(playlist.id)}
									>
										{playlist.name}
									</DropdownMenuItem>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<DropdownMenuItem disabled={!selectMode} onClick={handleBulkDelete}>
							<TrashIcon className="mr-3" />
							<span>Remove from collection</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Input
				name="search"
				type="search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.currentTarget.value)}
				placeholder="Search your collection"
			/>
		</div>
	);
}
