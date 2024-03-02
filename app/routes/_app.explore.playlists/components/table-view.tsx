import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { Playlist, PlaylistWithStuffAndCount } from "@/types";

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
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlists.map((playlist) => (
					<TableRow key={playlist.id}>
						<TableCell>{playlist.name}</TableCell>
						<TableCell>{Math.floor(playlist.aggRating)}</TableCell>
						<TableCell>{playlist.followerCount}</TableCell>
						<TableCell>12</TableCell>
						<TableCell>tags</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
