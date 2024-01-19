import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaylistContextMenu } from "@/features/playlists/components/playlist-context-menu";
import { Playlist } from "@/types/playlists";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

interface SidebarProps {
  playlists: Playlist[];
  setDialogOpen: (open: boolean) => void;
  hasSession: boolean;
}

export function Sidebar({ playlists, setDialogOpen, hasSession }: SidebarProps) {
  return (
    <div className="h-full w-full border py-3 pl-8 pr-3">
      <Tabs defaultValue="playlists">
        <TabsList className="w-full">
          <TabsTrigger value="playlists" className="w-full">
            Playlists
          </TabsTrigger>
          <TabsTrigger value="friends" className="w-full">
            Friends
          </TabsTrigger>
        </TabsList>
        <TabsContent value="playlists">
          <Button
            onClick={() => setDialogOpen(true)}
            variant={"outline"}
            disabled={!hasSession}
          >
            <span className="mr-3">Create new</span><PlusIcon />
          </Button>
          <div className="flex flex-col gap-2 py-4">
            {playlists.map((playlist) => (
              <SidebarPlaylistEntry key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="friends">
          <div>Friends</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SidebarPlaylistEntryProps {
  playlist: Playlist;
}

function SidebarPlaylistEntry({ playlist }: SidebarPlaylistEntryProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: playlist.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <PlaylistContextMenu asChild>
      <Link
        to={`playlists/${playlist.id}`}
        className="rounded-md p-4 hover:bg-background-hover"
        ref={setNodeRef}
        style={style}
      >
        <span className="text-sm font-bold">{playlist.name}</span>
      </Link>
    </PlaylistContextMenu>
  );
}
