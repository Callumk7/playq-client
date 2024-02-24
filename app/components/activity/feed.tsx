import { Game, Playlist, User } from "@/types";
import { Link } from "@remix-run/react";

interface PlaylistCreatedActivityProps {
	user: User;
	playlist: Playlist | null;
}

export function PlaylistCreatedActivity({
	user,
	playlist,
}: PlaylistCreatedActivityProps) {
	return (
		<div className="flex flex-wrap gap-x-3">
			<UsernameLink user={user} />
			<span>has created a new playlist!</span>
			{playlist && <PlaylistLink playlist={playlist} />}
		</div>
	);
}

interface AddedToCollectionActivityProps {
	user: User;
	game: Game | null;
}

export function AddedToCollectionActivity({
	user,
	game,
}: AddedToCollectionActivityProps) {
	return (
		<div className="flex flex-wrap gap-x-3">
			<UsernameLink user={user} />
			<span>has added a new game to their collection!</span>
			{game && <GameLink game={game} />}
		</div>
	);
}

interface AddedGameToPlaylistActivityProps {
	user: User;
	playlist: Playlist | null;
	game: Game | null;
}

export function AddedGameToPlaylistActivity({
	user,
	playlist,
	game,
}: AddedGameToPlaylistActivityProps) {
	return (
		<div className="flex flex-wrap gap-x-3">
			<UsernameLink user={user} />
			<span>has added</span>
			{game && <GameLink game={game} />}
			<span>to their playlist</span>
			{playlist && <PlaylistLink playlist={playlist} />}
		</div>
	);
}

interface RemovedGameFromPlaylistActivityProps {
	user: User;
	playlist: Playlist | null;
	game: Game | null;
}

export function RemovedGameFromPlaylistActivity({
	user,
	playlist,
	game,
}: RemovedGameFromPlaylistActivityProps) {
	return (
		<div className="flex flex-wrap gap-x-3">
			<UsernameLink user={user} />
			<span>has removed</span>
			{game && <GameLink game={game} />}
			<span>from their playlist</span>
			{playlist && <PlaylistLink playlist={playlist} />}
		</div>
	);
}

interface UsernameLinkProps {
	user: User;
}
export function UsernameLink({ user }: UsernameLinkProps) {
	return (
		<Link to={`users/${user.id}`} className="text-primary font-semibold hover:underline">
			{user.username}
		</Link>
	);
}

interface PlaylistLinkProps {
	playlist: Playlist;
}
export function PlaylistLink({ playlist }: PlaylistLinkProps) {
	return (
		<Link
			to={`/playlists/view/${playlist.id}`}
			className="text-primary font-semibold hover:underline"
		>
			{playlist.name}
		</Link>
	);
}

interface GameLinkProps {
	game: Game;
}
export function GameLink({ game }: GameLinkProps) {
	return (
		<Link
			to={`/collection/${game.gameId}`}
			className="text-primary font-semibold hover:underline"
		>
			{game.title}
		</Link>
	);
}
