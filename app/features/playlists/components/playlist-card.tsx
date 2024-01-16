import { DBImage } from "@/features/library/components/game-cover";
import { GameWithCover } from "@/types/games";
import { Playlist } from "@/types/playlists";
import { Link } from "@remix-run/react";

interface PlaylistCardProps {
  playlistId: string;
  playlistName: string;
  games: {
    id: string;
    cover: {
      imageId: string;
    }
  }[];
  creator: {
    id: string;
    email: string;
  };
}

export function PlaylistCard({ playlistId, playlistName, games, creator }: PlaylistCardProps) {
  return (
    <div className="h-64 w-full rounded-lg bg-background-3 p-5">
      <Link className="font-bold hover:underline" to={`/playlists/${playlistId}`}>
        {playlistName}
      </Link>
      {/*This really needs to be a username, but I am not certain I have the process
      in place yet to ensure that the username is set when an account is created*/}
      <p className="overflow-clip text-sm">{creator.email}</p>
      <div className="flex flex-wrap gap-1 overflow-clip h-full">
        {games.map((game) => (
          <div key={game.id} className="h-20 w-16">
            <DBImage imageId={game.cover.imageId} size="cover_big" />
          </div>
        ))}
      </div>
    </div>
  );
}
