import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Label,
	GameCover,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TagArray,
} from "@/components";
import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { users } from "db/schema/users";
import { eq } from "drizzle-orm";
import { getFriendsCollection, getFriendsPlaylists } from "./loader";
import { PlaylistProgress } from "../res.playlist-sidebar.$userId";
import { PlaylistWithGamesTagsFollows } from "@/types";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const friendId = params.friendId!;

	// friend's playlists
	const friendCollectionPromise = getFriendsCollection(friendId, 12);
	const friendsPlaylistsPromise = getFriendsPlaylists(friendId);
	const friendProfilePromise = db.query.users.findFirst({
		where: eq(users.id, friendId),
	});

	const [friendCollection, friendsPlaylists, friendProfile] = await Promise.all([
		friendCollectionPromise,
		friendsPlaylistsPromise,
		friendProfilePromise,
	]);

	return json({ friendsPlaylists, friendProfile, friendCollection, session });
};

export default function FriendsRoute() {
	const { friendsPlaylists, friendProfile, friendCollection, session } =
		useLoaderData<typeof loader>();
	return (
		<div className="space-y-7 my-10">
			<Card>
				<CardHeader>
					<CardTitle>{friendProfile?.username}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4">
						<div className="col-span-1">
							<Label>Name</Label>
						</div>
						<div className="col-span-2">
							<span>{friendProfile?.firstName}</span>{" "}
							<span>{friendProfile?.lastName}</span>
						</div>
						<div className="col-span-1">
							<Label>Email</Label>
						</div>
						<div className="col-span-2">
							<span>{friendProfile?.email}</span>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className="grid grid-cols-3 gap-5">
				<div className="col-span-1">
					<Card>
						<CardHeader>
							<CardTitle>Top Rated Games</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-3 gap-2">
								{friendCollection.map((game) => (
									<GameCover
										key={game.gameId}
										gameId={game.gameId}
										coverId={game.game.cover.imageId}
									/>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Top Playlists</CardTitle>
						</CardHeader>
						<CardContent>
							<PlaylistTable userId={session.user.id} playlists={friendsPlaylists} />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

interface PlaylistTableProps {
	userId: string;
	playlists: PlaylistWithGamesTagsFollows[];
}
function PlaylistTable({ userId, playlists }: PlaylistTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Games</TableHead>
					<TableHead>Tags</TableHead>
					<TableHead>Progress</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlists.map((playlist) => (
					<TableRow key={playlist.id}>
						<TableCell className="font-semibold">
							<Link to={`/playlists/view/${playlist.id}`}>{playlist.name}</Link>
						</TableCell>
						<TableCell>{playlist.games.length}</TableCell>
						<TableCell>
							<TagArray tags={playlist.tags.map((tag) => tag.tag.name)} />
						</TableCell>
						<TableCell>
							<PlaylistProgress
								userId={userId}
								playlistId={playlist.id}
								max={playlist.games.length}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
