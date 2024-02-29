import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	Slider,
	Label,
} from "@/components";
import { FollowPlaylistButton } from "@/features/playlists/components/follow-playlist-button";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

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
	const [rating, setRating] = useState(0);
	const fetcher = useFetcher();
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
			<Popover>
				<PopoverTrigger asChild>
					<Button variant={"outline"} size={"icon"}>
						<MixerHorizontalIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Rate Playlist</h4>
							<p className="text-sm text-muted-foreground">How good is this list?</p>
						</div>
						<fetcher.Form action={`/api/playlists/${playlistId}/ratings`} method="POST">
							<Label htmlFor="rating">Rating: {rating}</Label>
							<Slider
								value={[rating]}
								onValueChange={(v) => setRating(v[0])}
								name="rating"
								id="rating"
							/>
							<input type="hidden" value={userId} name="user_id" />
							<Button variant={"outline"} size={"sm"} type="submit">
								Submit
							</Button>
						</fetcher.Form>
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
