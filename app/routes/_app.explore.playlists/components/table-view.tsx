import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { PlaylistWithStuffAndCount } from "@/types";
import { Link } from "@remix-run/react";

interface PlaylistTableViewProps {
	playlists: PlaylistWithStuffAndCount[];
}

export function PlaylistTableView({ playlists }: PlaylistTableViewProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Rating</TableHead>
					<TableHead>Followers</TableHead>
					<TableHead>Games</TableHead>
					<TableHead>Tags</TableHead>
          <TableHead>Controls</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlists.map((playlist) => (
					<TableRow key={playlist.id}>
						<TableCell><Link to={`/playlists/view/${playlist.id}`}>{playlist.name}</Link></TableCell>
						<TableCell>{Math.floor(playlist.aggRating)}</TableCell>
						<TableCell>{playlist.followerCount}</TableCell>
						<TableCell>12</TableCell>
						<TableCell>tags</TableCell>
            <TableCell>controls</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
