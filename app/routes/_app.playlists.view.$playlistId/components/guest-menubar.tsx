import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	FollowPlaylistButton,
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
	SortAndView,
	Filters,
} from "@/components";
import { usePlaylistViewStore } from "@/store/playlist-view";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
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
		<div className="flex gap-4 items-center">
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
			<Popover>
				<PopoverTrigger asChild>
					<Button variant={"outline"} size={"icon"}>
						<MixerHorizontalIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="grid gap-4">
						<h4 className="font-medium leading-none">Rate Playlist</h4>
					</div>
				</PopoverContent>
			</Popover>
			<FollowPlaylistButton
				isFollowedByUser={isFollowing}
				userId={userId}
				playlistId={playlistId}
			/>
		</div>
	);
}
