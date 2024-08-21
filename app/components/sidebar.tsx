import { PlaylistContextMenu, PlaylistDropdownMenu } from "@/features/playlists/components/playlist-context-menu";
import { PlaylistWithCreator } from "@/types/playlists";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Button, ScrollArea, usePlaylistDialogOpen } from ".";
interface SidebarProps {
	userId: string;
	playlists: PlaylistWithCreator[];
	hasSession: boolean;
}

export function Sidebar({ playlists, hasSession }: SidebarProps) {
	const { setPlaylistDialogOpen } = usePlaylistDialogOpen();
	return (
		<div className="py-3 px-3 w-full h-screen border">
			<div className="flex gap-5 mt-5">
				<Button
					onClick={() => setPlaylistDialogOpen(true)}
					variant={"outline"}
					size={"sm"}
					disabled={!hasSession}
					className="w-full"
				>
					<span className="mr-3">Create Playlist</span>
					<PlusIcon />
				</Button>
			</div>
			<ScrollArea className="mt-5 w-full h-[90vh]">
				<div className="flex flex-col gap-2 py-4">
					{playlists.map((playlist) => (
						<SidebarPlaylistEntry key={playlist.id} playlist={playlist} />
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

interface SidebarPlaylistEntryProps {
	playlist: PlaylistWithCreator;
}

function SidebarPlaylistEntry({ playlist }: SidebarPlaylistEntryProps) {
	return (
		<PlaylistContextMenu playlist={playlist}>
			<Link
				to={`playlists/view/${playlist.id}`}
				className="flex gap-2 justify-between items-start p-4 w-full rounded-md hover:bg-background-hover"
			>
				<div className="flex flex-col gap-1 w-3/5">
					<span className="text-sm font-bold">{playlist.name}</span>
					<span className="text-sm font-light text-gray-400">
						{playlist.creator.username}
					</span>
				</div>
        <PlaylistDropdownMenu playlist={playlist} />
			</Link>
		</PlaylistContextMenu>
	);
}
