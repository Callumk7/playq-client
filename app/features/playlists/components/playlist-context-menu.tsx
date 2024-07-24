import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	useDeletePlaylistDialogOpen,
} from "@/components";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useAppData } from "@/routes/_app/route";
import { PlaylistWithCreator } from "@/types";
import { HamburgerMenuIcon, TrashIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface PlaylistContextMenuProps {
	playlist: PlaylistWithCreator;
	children: React.ReactNode;
	asChild?: boolean;
}
export function PlaylistContextMenu({
	playlist,
	children,
	asChild = false,
}: PlaylistContextMenuProps) {
	const { session } = useAppData();

	const handleUnfollowPlaylist = useUnfollowOrDeletePlaylist(playlist, session.user.id);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild={asChild}>{children}</ContextMenuTrigger>
			<ContextMenuContent alignOffset={24}>
				<ContextMenuItem onClick={handleUnfollowPlaylist}>
					<TrashIcon />
					<span>Delete</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export function PlaylistDropdownMenu({ playlist }: { playlist: PlaylistWithCreator }) {
	const { session } = useAppData();

	const handleUnfollowPlaylist = useUnfollowOrDeletePlaylist(playlist, session.user.id);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<HamburgerMenuIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={handleUnfollowPlaylist}>
					<TrashIcon />
					<span>Delete</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const useUnfollowOrDeletePlaylist = (playlist: PlaylistWithCreator, userId: string) => {
	const fetcher = useFetcher();
	const { setDeletePlaylistDialogOpen } = useDeletePlaylistDialogOpen();

	const handleUnfollowPlaylist = () => {
		if (playlist.creator.id === userId) {
			setDeletePlaylistDialogOpen(true);
		} else {
			fetcher.submit(
				{ userId, playlistId: playlist.id },
				{
					method: "DELETE",
					action: "/api/followers",
				},
			);
		}
	};

	return handleUnfollowPlaylist;
};
