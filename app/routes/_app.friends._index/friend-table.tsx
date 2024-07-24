import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { UserWithPlaylistsFollowsGames } from "@/types";
import { Link } from "@remix-run/react";

interface FriendTableProps {
	friends: UserWithPlaylistsFollowsGames[];
}
export function FriendTable({ friends }: FriendTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Playlist Follows</TableHead>
					<TableHead>Playlists Created</TableHead>
					<TableHead>Games in Collection</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{friends.map((friend) => (
					<TableRow key={friend.id}>
						<Link className="font-semibold" to={`/friends/${friend.id}`}>
							<TableCell>{friend.username}</TableCell>
						</Link>
						<TableCell>{friend.playlistFollows.length}</TableCell>
						<TableCell>{friend.playlists.length}</TableCell>
						<TableCell>{friend.games.length}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
