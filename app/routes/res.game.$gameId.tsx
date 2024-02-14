import { DBImage } from "@/features/library/components/game-cover";
import { UserWithActivityFeedEntry } from "@/types";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "db";
import { games } from "db/schema/games";
import { eq } from "drizzle-orm";
import { useEffect } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const gameId = Number(params.gameId);
	const gameData = await db.query.games.findFirst({
		where: eq(games.gameId, gameId),
		with: {
			cover: true,
			screenshots: true,
			artworks: true,
			genres: {
				with: {
					genre: true,
				},
			},
		},
	});

	return json({ gameData });
};

export function GameComponent({ gameId }: { gameId: number }) {
	const gameFetcher = useFetcher<typeof loader>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		gameFetcher.submit({}, { method: "GET", action: `/res/game/${gameId}` });
	}, []);

	const isSubmitting = gameFetcher.state === "submitting";
	return (
		<div>
			{isSubmitting ? <h1>SUBMITTING FOR DATA</h1> : null}
			{gameFetcher.data ? (
				<div>
					<h1>{gameFetcher.data.gameData?.title}</h1>
					<DBImage imageId={gameFetcher.data.gameData!.cover.imageId} size="cover_big" />
				</div>
			) : (
				<div>Waiting for data...</div>
			)}
		</div>
	);
}

export function SavedToCollectionActivity({
	activity,
}: { activity: UserWithActivityFeedEntry }) {
	const fetcher = useFetcher<typeof loader>();
	// biome-ignore lint/correctness/useExhaustiveDependencies: only fetch once
	useEffect(() => {
		const delay = Math.random() * (5000 - 1000) + 1000; // generates random delay between 1000ms (1 second) and 5000ms (5 seconds)

		const timeoutId = setTimeout(() => {
			fetcher.submit(
				{},
				{ action: `/res/game/${activity.activity.gameId}`, method: "get" },
			);
		}, delay);

		// It's important to return a cleanup function to clear the timeout when the component unmounts
		return () => clearTimeout(timeoutId);
	}, []);
	const isLoading = fetcher.state === "submitting" || fetcher.state === "loading";
	const isFetching = !fetcher.data;
	return (
		<div className="flex flex-wrap gap-x-2">
			<span className="text-primary">{activity.username}</span>
			<span>has added</span>
			<span className="text-primary">
				{isFetching ? "game title" : fetcher.data?.gameData?.title}
			</span>
			<span>to their collection</span>
		</div>
	);
}
