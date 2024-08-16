import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
	SortAndView,
	Filters,
} from "@/components";
import { usePlaylistViewStore } from "@/store/playlist-view";
import { useFetcher } from "@remix-run/react";

interface GuestMenubarProps {
	isFollowing: boolean;
	playlistId: string;
	userId: string;
	userPlaylistRating: number | null;
}

export function GuestMenubar({ isFollowing, playlistId, userId }: GuestMenubarProps) {
	const store = usePlaylistViewStore();
	const followFetcher = useFetcher();
	const handleToggle = () => {
		followFetcher.submit(
			{ userId: userId, playlistId: playlistId },
			{ method: isFollowing ? "DELETE" : "POST", action: "/api/followers" },
		);
	};

	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Options</MenubarTrigger>
				<MenubarContent>
					<MenubarItem onClick={() => store.setRatePlaylistDialogOpen(true)}>
						Rate
					</MenubarItem>
					<MenubarItem onClick={handleToggle}>
						{isFollowing ? "Unfollow" : "Follow"}
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<SortAndView store={store} />
			<Filters store={store} />
		</Menubar>
	);
}
