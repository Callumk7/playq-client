import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
} from "@/components";
import { FollowPlaylistButton } from "@/features/playlists/components/follow-playlist-button";

interface GuestMenubarProps {
	isFollowing: boolean;
	playlistId: string;
	userId: string;
	userPlaylistRating: number | null;
}

export function GuestMenubar({
	isFollowing,
	playlistId,
	userId,
	userPlaylistRating,
}: GuestMenubarProps) {
	return (
		<div className="flex items-center gap-4">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Menu</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>{userPlaylistRating ?? 0}</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
			<FollowPlaylistButton
				isFollowedByUser={isFollowing}
				userId={userId}
				playlistId={playlistId}
			/>
		</div>
	);
}
