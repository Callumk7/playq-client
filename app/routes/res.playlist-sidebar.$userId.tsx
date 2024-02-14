import { Card, CardHeader, CardTitle, CardContent, Progress, Label } from "@/components";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { gamesOnPlaylists } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get("userId");
	const playlistId = url.searchParams.get("playlistId");

	if (!userId || !playlistId) {
		return {
			inCollectionCount: 0,
			playedCount: 0,
			completedCount: 0,
		};
	}

	const collectionData = await db
		.select()
		.from(gamesOnPlaylists)
		.leftJoin(usersToGames, eq(gamesOnPlaylists.gameId, usersToGames.gameId))
		.where(
			and(eq(gamesOnPlaylists.playlistId, playlistId), eq(usersToGames.userId, userId)),
		);

	let inCollectionCount = 0;
	let playedCount = 0;
	let completedCount = 0;
	const max = collectionData.length;
	for (const result of collectionData) {
		if (result.users_to_games) {
			inCollectionCount += 1;
			if (result.users_to_games.played) {
				playedCount += 1;
			}
			if (result.users_to_games.completed) {
				completedCount += 1;
			}
		}
	}

	return { inCollectionCount, playedCount, completedCount };
};

interface StatsSidebarProps {
	userId: string;
	playlistId: string;
	max: number;
	followerCount: number;
}
export function StatsSidebar({
	userId,
	playlistId,
	max,
	followerCount,
}: StatsSidebarProps) {
	const fetcher = useFetcher<typeof loader>();
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run the effect on mount
	useEffect(() => {
		fetcher.submit(
			{ userId: userId, playlistId: playlistId },
			{ method: "get", action: `/res/playlist-sidebar/${userId}` },
		);
	}, []);
	return (
		<div className="h-full flex flex-col gap-8">
			<Card>
				<CardHeader>
					<CardTitle>Progress</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-1">
							<Label>In your Collection</Label>
							<Progress
								value={fetcher.data ? fetcher.data.inCollectionCount : 0}
								max={max}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label>Played</Label>
							<Progress value={fetcher.data ? fetcher.data.playedCount : 0} max={max} />
						</div>
						<div className="flex flex-col gap-1">
							<Label>Completed</Label>
							<Progress
								value={fetcher.data ? fetcher.data.completedCount : 0}
								max={max}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Playlist Stats</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-5">
						<div className="flex justify-between">
							<p className="font-semibold">Followers:</p>
							<p>{followerCount}</p>
						</div>
						<div className="flex justify-between">
							<p className="font-semibold">Rating:</p>
							<p>59</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
