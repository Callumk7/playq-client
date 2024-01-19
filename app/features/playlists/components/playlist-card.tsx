import { DBImage } from "@/features/library/components/game-cover";
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
    username: string;
  };
}

export function PlaylistCard({ playlistId, playlistName, games, creator }: PlaylistCardProps) {
  return (
    <div className="w-full rounded-lg bg-background-3 p-5 overflow-hidden flex flex-col gap-3">
      <Link className="font-bold hover:underline text-xl" to={`/playlists/${playlistId}`}>
        {playlistName}
      </Link>
      <p className="overflow-clip text-sm">{creator.username}</p>
      <div className="grid grid-cols-2 rounded-lg overflow-hidden h-fit">
        {games.map((game) => (
          <div key={game.id}>
            <DBImage imageId={game.cover.imageId} size="cover_big" />
          </div>
        ))}
      </div>
    </div>
  );
}
