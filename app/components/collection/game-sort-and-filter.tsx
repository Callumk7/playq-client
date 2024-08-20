import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CardStackIcon,
	Cross1Icon,
	GroupIcon,
	StarFilledIcon,
	TableIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { useCollectionStore } from "@/store/collection";
import { Playlist } from "@/types";
import { useFetcher } from "@remix-run/react";
import { FilterState, SortState, ViewState } from "@/store/types";
import { useAppData } from "@/routes/_app/route";

export function GameSortAndFilterMenu() {
	const store = useCollectionStore();
	const { session, userPlaylists } = useAppData();
	return (
		<Menubar>
			<SortAndView store={store} />
			<Filters store={store} />
			<Select userId={session.user.id} userPlaylists={userPlaylists} />
		</Menubar>
	);
}

type Store = SortState & ViewState;

interface SortAndViewProps {
	store: Store;
}

export function SortAndView({ store }: SortAndViewProps) {
	const { sortOption, setSortOption, isTableView, setIsTableView } = store;
	return (
		<MenubarMenu>
			<MenubarTrigger>View</MenubarTrigger>
			<MenubarContent className="w-64">
				<MenubarLabel>Sort Options</MenubarLabel>
				<MenubarRadioGroup value={sortOption}>
					<MenubarRadioItem value="rating" onClick={() => setSortOption("ratingDesc")}>
						Rating
					</MenubarRadioItem>
					<MenubarRadioItem
						className="flex justify-between"
						value={sortOption === "nameAsc" ? "nameAsc" : "nameDesc"}
						onClick={
							sortOption === "nameAsc"
								? () => setSortOption("nameDesc")
								: () => setSortOption("nameAsc")
						}
					>
						<span>Alphabetical</span>
						{sortOption === "nameAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
					</MenubarRadioItem>
					<MenubarRadioItem
						className="flex justify-between"
						value={sortOption === "releaseDateAsc" ? "releaseDateAsc" : "releaseDateDesc"}
						onClick={
							sortOption === "releaseDateAsc"
								? () => setSortOption("releaseDateDesc")
								: () => setSortOption("releaseDateAsc")
						}
					>
						<span>Release Date</span>
						{sortOption === "releaseDateAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
					</MenubarRadioItem>
					<MenubarRadioItem
						className="flex justify-between"
						value={sortOption === "dateAddedAsc" ? "dateAddedAsc" : "dateAddedDesc"}
						onClick={
							sortOption === "dateAddedAsc"
								? () => setSortOption("dateAddedDesc")
								: () => setSortOption("dateAddedAsc")
						}
					>
						<span>Date Added To Collection</span>
						{sortOption === "releaseDateAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
					</MenubarRadioItem>
					<MenubarRadioItem
						className="flex justify-between"
						value={
							sortOption === "playerRatingAsc" ? "playerRatingAsc" : "playerRatingDesc"
						}
						onClick={
							sortOption === "playerRatingAsc"
								? () => setSortOption("playerRatingDesc")
								: () => setSortOption("playerRatingAsc")
						}
					>
						<span>Your Rating</span>
						{sortOption === "playerRatingAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
					</MenubarRadioItem>
				</MenubarRadioGroup>
				<MenubarSeparator />
				<MenubarLabel>View Options</MenubarLabel>
				<MenubarItem
					onClick={() => setIsTableView(false)}
					className={isTableView ? "" : "text-primary"}
				>
					<CardStackIcon className="mr-3" />
					<span>Card View</span>
				</MenubarItem>
				<MenubarItem
					onClick={() => setIsTableView(true)}
					className={isTableView ? "text-primary" : ""}
				>
					<TableIcon className="mr-3" />
					<span>Table View</span>
				</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
}

interface FiltersProps {
	store: FilterState;
}
export function Filters({ store }: FiltersProps) {
	return (
		<MenubarMenu>
			<MenubarTrigger>Filter</MenubarTrigger>
			<MenubarContent>
				<MenubarCheckboxItem
					checked={store.filterOnCompleted}
					onClick={store.handleToggleFilterOnCompleted}
				>
					Completed
				</MenubarCheckboxItem>
				<MenubarCheckboxItem
					checked={store.filterOnUnCompleted}
					onClick={store.handleToggleFilterOnUnCompleted}
				>
					Not Completed
				</MenubarCheckboxItem>
				<MenubarCheckboxItem
					checked={store.filterOnPlayed}
					onClick={store.handleToggleFilterOnPlayed}
				>
					Played
				</MenubarCheckboxItem>
				<MenubarCheckboxItem
					checked={store.filterOnUnPlayed}
					onClick={store.handleToggleFilterOnUnPlayed}
				>
					Not Played
				</MenubarCheckboxItem>
				<MenubarCheckboxItem
					checked={store.filterOnRated}
					onClick={store.handleToggleFilterOnRated}
				>
					Rated
				</MenubarCheckboxItem>
				<MenubarCheckboxItem
					checked={store.filterOnUnrated}
					onClick={store.handleToggleFilterOnUnrated}
				>
					Not Rated
				</MenubarCheckboxItem>
				{(store.filterOnPlayed ||
					store.filterOnUnPlayed ||
					store.filterOnStarred ||
					store.filterOnRated ||
					store.filterOnUnCompleted ||
					store.filterOnCompleted ||
					store.filterOnUnrated ||
					store.genreFilter.length > 0) && (
					<MenubarItem
						inset
						className="font-bold text-destructive"
						onClick={() => {
							store.setGenreFilter([]);
							store.setFilterOnPlayed(false);
							store.setFilterOnUnPlayed(false);
							store.setFilterOnRated(false);
							store.setFilterOnCompleted(false);
							store.setFilterOnUnCompleted(false);
							store.setFilterOnUnRated(false);
						}}
					>
						Clear Filters
					</MenubarItem>
				)}
			</MenubarContent>
		</MenubarMenu>
	);
}

interface SelectProps {
	userId: string;
	userPlaylists: Playlist[];
}

function Select({ userPlaylists, userId }: SelectProps) {
	const store = useCollectionStore();

	const playlistFetcher = useFetcher();
	const handleBulkAddToPlaylist = (playlistId: string) => {
		const formData = new FormData();
		formData.append("addedBy", userId);
		for (const gameId of store.selectedGames) {
			formData.append("gameIds", String(gameId));
		}
		playlistFetcher.submit(formData, {
			method: "POST",
			action: `/api/playlists/${playlistId}/games`,
		});
	};

	const updateFetcher = useFetcher();
	const handleMarkAsPlayed = () => {
		const formData = new FormData();
		formData.append("userId", userId);
		formData.append("update", "played");
		for (const gameId of store.selectedGames) {
			formData.append("gameIds", String(gameId));
		}
		updateFetcher.submit(formData, {
			method: "PATCH",
			action: "/api/collections/bulk",
		});
	};
	const handleMarkAsCompleted = () => {
		const formData = new FormData();
		formData.append("userId", userId);
		formData.append("update", "completed");
		for (const gameId of store.selectedGames) {
			formData.append("gameIds", String(gameId));
		}
		updateFetcher.submit(formData, {
			method: "PATCH",
			action: "/api/collections/bulk",
		});
	};

	const deleteFetcher = useFetcher();
	const handleBulkDelete = () => {
		const formData = new FormData();
		formData.append("userId", userId);
		for (const gameId of store.selectedGames) {
			formData.append("gameIds", String(gameId));
		}
		deleteFetcher.submit(formData, {
			method: "DELETE",
			action: "/api/collections/bulk",
		});
	};
	return (
		<MenubarMenu>
			<MenubarTrigger>Select</MenubarTrigger>
			<MenubarContent>
				<MenubarItem onClick={() => store.setSelectModeOn(!store.selectModeOn)}>
					<GroupIcon className="mr-3" />
					{store.selectModeOn ? <span>Cancel Select</span> : <span>Select Mode</span>}
				</MenubarItem>
				<MenubarSeparator />
				<MenubarSub>
					<MenubarSubTrigger disabled={!store.selectModeOn} inset>
						Add to playlist
					</MenubarSubTrigger>
					<MenubarSubContent>
						{userPlaylists.map((playlist) => (
							<MenubarItem
								key={playlist.id}
								onClick={() => handleBulkAddToPlaylist(playlist.id)}
							>
								{playlist.name}
							</MenubarItem>
						))}
					</MenubarSubContent>
				</MenubarSub>
				<MenubarSeparator />
				<MenubarItem disabled={!store.selectModeOn} onClick={handleMarkAsPlayed}>
					<StarFilledIcon className="mr-3" />
					<span>Mark as played</span>
				</MenubarItem>
				<MenubarItem disabled={!store.selectModeOn} onClick={handleMarkAsCompleted}>
					<StarFilledIcon className="mr-3" />
					<span>Mark as completed</span>
				</MenubarItem>
				<MenubarItem disabled={!store.selectModeOn} onClick={handleBulkDelete}>
					<TrashIcon className="mr-3" />
					<span>Delete</span>
				</MenubarItem>
				<MenubarItem onClick={() => store.setSelectedGames([])}>
					<Cross1Icon className="mr-3" />
					<span>Clear Selected</span>
				</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
}
