import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaylistContextMenu } from "@/features/playlists/components/playlist-context-menu";
import { Playlist } from "@/types/playlists";
import { User } from "@/types/users";
import { useDroppable } from "@dnd-kit/core";
import { HamburgerMenuIcon, PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

interface SidebarProps {
  userId: string;
  playlists: Playlist[];
  friends: User[];
  setDialogOpen: (open: boolean) => void;
  hasSession: boolean;
}

export function Sidebar({
  userId,
  playlists,
  friends,
  setDialogOpen,
  hasSession,
}: SidebarProps) {
  return (
    <div className="h-full w-full border px-5 py-3">
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
          <div className="mt-5 flex gap-5">
            <Button
              onClick={() => setDialogOpen(true)}
              variant={"outline"}
              size={"sm"}
              disabled={!hasSession}
            >
              <span className="mr-3">Create new</span>
              <PlusIcon />
            </Button>
            <Button size={"sm"} variant={"outline"}>
              <HamburgerMenuIcon />
            </Button>
          </div>
          <div className="flex flex-col gap-2 py-4">
            {playlists.map((playlist) => (
              <SidebarPlaylistEntry
                key={playlist.id}
                playlist={playlist}
                isCreator={playlist.creatorId === userId}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="friends">
          <div>
            {friends.map((friend) => (
              <SidebarFriendEntry key={friend.id} friend={friend} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SidebarPlaylistEntryProps {
  playlist: Playlist;
  isCreator: boolean;
}

function SidebarPlaylistEntry({ playlist, isCreator }: SidebarPlaylistEntryProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: playlist.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <PlaylistContextMenu asChild>
      <Link
        to={`playlists/view/${playlist.id}`}
        className="flex gap-2 rounded-md p-4 hover:bg-background-hover items-center"
        ref={setNodeRef}
        style={style}
      >
        {isCreator && <div className="h-2 w-2 rounded-full bg-primary" />}
        <span className="text-sm font-bold">{playlist.name}</span>
      </Link>
    </PlaylistContextMenu>
  );
}

interface SidebarFriendEntryProps {
  friend: User;
}

function SidebarFriendEntry({ friend }: SidebarFriendEntryProps) {
  return <div>{friend.email}</div>;
}
