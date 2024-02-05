import { DBImage } from "@/features/library/components/game-cover";
import { Link } from "@remix-run/react";

interface PlaylistCardProps {
  playlistId: string;
  playlistName: string;
  games: {
    id: string;
    cover: {
      imageId: string;
    };
  }[];
  creator: {
    id: string;
    username: string;
  };
}

export function PlaylistCard({
  playlistId,
  playlistName,
  games,
  creator,
}: PlaylistCardProps) {
  return (
    <div className="flex w-full flex-col gap-3 overflow-hidden rounded-lg bg-background-3 p-5">
      <Link
        className="text-xl font-bold hover:underline"
        to={`/playlists/view/${playlistId}`}
      >
        {playlistName}
      </Link>
      <p className="overflow-clip text-sm">{creator.username}</p>
      <div className="grid h-fit grid-cols-2 overflow-hidden rounded-lg">
        {games.map((game) => (
          <div key={game.id}>
            <DBImage imageId={game.cover.imageId} size="cover_big" />
          </div>
        ))}
      </div>
    </div>
  );
}
