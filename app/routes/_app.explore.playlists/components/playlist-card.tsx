import { DBImage } from "@/components";
import { FollowPlaylistButton } from "@/features/playlists/components/follow-playlist-button";
import { PlaylistGenres } from "@/routes/res.playlist-genres";
import { PlaylistWithFollowers, PlaylistWithStuffAndCount } from "@/types/playlists";
import { Link } from "@remix-run/react";

interface PlaylistCardProps {
	playlist: PlaylistWithStuffAndCount;
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

export function PlaylistCard({ playlist, games, creator }: PlaylistCardProps) {
	return (
		<Link
			to={`/playlists/view/${playlist.id}`}
			className="flex overflow-hidden relative gap-3 justify-between p-5 w-full rounded-lg transition-colors ease-in-out bg-background-3 hover:bg-primary/10"
		>
			<div className="flex flex-col gap-4 w-1/3">
				<h1 className="text-2xl font-semibold">{playlist.name}</h1>
				<p className="text-sm overflow-clip text-primary">{creator.username}</p>
				<PlaylistGenres gameIds={games.map((game) => game.gameId)} />
			</div>
			<div className="grid overflow-hidden grid-cols-4 w-1/2 rounded-lg h-fit">
				{games.map((game) => (
					<div key={game.id}>
						<DBImage imageId={game.cover.imageId} size="cover_big" />
					</div>
				))}
			</div>
		</Link>
	);
}
