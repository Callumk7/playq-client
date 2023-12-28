import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Playlist } from "@/types/playlists";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

interface SidebarProps {
  playlists: Playlist[];
  setDialogOpen: (open: boolean) => void;
}

export function Sidebar({ playlists, setDialogOpen }: SidebarProps) {
  return (
    <div className="h-full w-full border py-3 pr-3 pl-8">
      <div className="flex w-full justify-between">
        <h2 className="pb-2 pt-4 font-bold">Playlists</h2>
        <Button
          onClick={() => setDialogOpen(true)}
          variant={"ghost"}
        >
          <PlusIcon />
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-2 py-4">
        {playlists.map((playlist) => (
          <SidebarPlaylistEntry key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}

interface SidebarPlaylistEntryProps {
  playlist: Playlist;
}

function SidebarPlaylistEntry({ playlist }: SidebarPlaylistEntryProps) {
  return (
    <Link to={`playlists/${playlist.id}`} className="rounded-md p-4 hover:bg-background-hover">
      <span className="font-bold text-sm">{playlist.name}</span>
    </Link>
  );
}
