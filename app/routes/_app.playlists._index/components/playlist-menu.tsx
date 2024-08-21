import { Button } from "@/components";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

interface PlaylistMenuProps {
	setPlaylistDialogOpen: (isOpen: boolean) => void;
}

export function PlaylistMenu({ setPlaylistDialogOpen }: PlaylistMenuProps) {
	return (
		<div className="flex gap-5 mt-5">
			<Button onClick={() => setPlaylistDialogOpen(true)} size={"sm"}>
				<span className="mr-3">Create new</span>
				<PlusIcon />
			</Button>
			<Button asChild variant={"outline"} size={"sm"}>
				<Link to="/explore/playlists">Explore Playlists</Link>
			</Button>
		</div>
	);
}
