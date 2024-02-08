import { Button } from "@/components/ui/button";
import { DBImage } from "@/features/library/components/game-cover";
import { PlaylistGenres } from "@/routes/res.playlist-genres";
import { Playlist, PlaylistWithFollowers } from "@/types/playlists";
import { BookmarkFilledIcon, BookmarkIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Link, useFetcher } from "@remix-run/react";
import { FollowPlaylistButton } from "./follow-playlist-button";

interface PlaylistCardProps {
  playlist: PlaylistWithFollowers;
  games: {
    id: string;
    gameId: number;
    cover: {
      imageId: string;
    };
  }[];
  creator: {
    id: string;
    username: string;
  };
  userId: string;
}

export function PlaylistCard({ playlist, userId, games, creator }: PlaylistCardProps) {
  const followFetcher = useFetcher();
  const isFollowedByUser = playlist.followers.some((f) => f.userId === userId);
  return (
    <Link
      to={`/playlists/view/${playlist.id}`}
      className="relative flex w-full justify-between gap-3 overflow-hidden rounded-lg bg-background-3 p-5 transition-colors ease-in-out hover:bg-primary/10"
    >
      <div className="flex w-1/3 flex-col gap-4">
        <h1 className="text-2xl font-semibold">{playlist.name}</h1>
        <p className="overflow-clip text-sm text-primary">{creator.username}</p>
        <PlaylistGenres gameIds={games.map((game) => game.gameId)} />
        <div className="absolute bottom-4 right-4">
          <FollowPlaylistButton isFollowedByUser={isFollowedByUser} userId={userId} playlistId={playlist.id} />
        </div>
      </div>
      <div className="grid h-fit w-1/2 grid-cols-4 overflow-hidden rounded-lg">
        {games.map((game) => (
          <div key={game.id}>
            <DBImage imageId={game.cover.imageId} size="cover_big" />
          </div>
        ))}
      </div>
    </Link>
  );
}


