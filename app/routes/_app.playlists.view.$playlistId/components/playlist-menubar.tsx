import {
	Button,
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarTrigger,
} from "@/components";
import { Game } from "@/types";
import { ArrowDownIcon, ArrowUpIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { usePlaylistViewStore } from "@/store/playlist-view";

interface PlaylistMenubarProps {
	isPrivate: boolean;
	userCollection: Game[];
	playlistId: string;
	playlistGames: number[];
	userId: string;
	setRenameDialogOpen: (renameDialogOpen: boolean) => void;
	setDeletePlaylistDialogOpen: (deletePlaylistDialogOpen: boolean) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}

export function PlaylistMenubar({
	isPrivate,
	playlistId,
	setDeletePlaylistDialogOpen,
}: PlaylistMenubarProps) {
	const markAsPrivateFetcher = useFetcher();
	const store = usePlaylistViewStore();

	const handleTogglePrivate = () => {
		markAsPrivateFetcher.submit(
			{ isPrivate: !isPrivate },
			{ action: `/api/playlists/${playlistId}`, method: "PATCH" },
		);
	};

	return (
		<div className="flex gap-3">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Menu</MenubarTrigger>
					<MenubarContent>
						<MenubarLabel>Playlist</MenubarLabel>
						<MenubarSeparator />
						<MenubarItem onClick={() => store.setIsEditing(!store.isEditing)}>
							Edit
						</MenubarItem>
						<MenubarItem onClick={() => setDeletePlaylistDialogOpen(true)}>
							Delete
						</MenubarItem>
						<MenubarItem onClick={() => store.setRenameDialogOpen(true)}>
							Rename
						</MenubarItem>
						<MenubarItem onClick={handleTogglePrivate}>
							{isPrivate ? "Make Public" : "Set as Private"}
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>Sort</MenubarTrigger>
					<MenubarContent>
						<MenubarRadioGroup value={store.sortOption}>
							<MenubarRadioItem
								value="rating"
								onClick={() => store.setSortOption("ratingDesc")}
							>
								Rating
							</MenubarRadioItem>
							<MenubarRadioItem
								className="flex justify-between"
								value={store.sortOption === "nameAsc" ? "nameAsc" : "nameDesc"}
								onClick={
									store.sortOption === "nameAsc"
										? () => store.setSortOption("nameDesc")
										: () => store.setSortOption("nameAsc")
								}
							>
								<span>Alphabetical</span>
								{store.sortOption === "nameAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
							</MenubarRadioItem>
							<MenubarRadioItem
								className="flex justify-between"
								value={
									store.sortOption === "releaseDateAsc"
										? "releaseDateAsc"
										: "releaseDateDesc"
								}
								onClick={
									store.sortOption === "releaseDateAsc"
										? () => store.setSortOption("releaseDateDesc")
										: () => store.setSortOption("releaseDateAsc")
								}
							>
								<span>Release Date</span>
								{store.sortOption === "releaseDateAsc" ? (
									<ArrowDownIcon />
								) : (
									<ArrowUpIcon />
								)}
							</MenubarRadioItem>
							<MenubarRadioItem
								className="flex justify-between"
								value={
									store.sortOption === "dateAddedAsc" ? "dateAddedAsc" : "dateAddedDesc"
								}
								onClick={
									store.sortOption === "dateAddedAsc"
										? () => store.setSortOption("dateAddedDesc")
										: () => store.setSortOption("dateAddedAsc")
								}
							>
								<span>Date Added To Collection</span>
								{store.sortOption === "releaseDateAsc" ? (
									<ArrowDownIcon />
								) : (
									<ArrowUpIcon />
								)}
							</MenubarRadioItem>
							<MenubarRadioItem
								className="flex justify-between"
								value={
									store.sortOption === "playerRatingAsc"
										? "playerRatingAsc"
										: "playerRatingDesc"
								}
								onClick={
									store.sortOption === "playerRatingAsc"
										? () => store.setSortOption("playerRatingDesc")
										: () => store.setSortOption("playerRatingAsc")
								}
							>
								<span>Your Rating</span>
								{store.sortOption === "playerRatingAsc" ? (
									<ArrowDownIcon />
								) : (
									<ArrowUpIcon />
								)}
							</MenubarRadioItem>
						</MenubarRadioGroup>
					</MenubarContent>
				</MenubarMenu>
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
			</Menubar>
			<Button
				variant={"outline"}
				aria-label="Add games button"
				onClick={() => store.setAddGameDialogOpen(true)}
			>
				<PlusCircledIcon className="mr-3" aria-hidden="true" />
				<span>Add Games</span>
			</Button>
		</div>
	);
}
