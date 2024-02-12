import { DBImage } from "@/features/library/components/game-cover";
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

	useEffect(() => {
		gameFetcher.submit({}, { method: "GET", action: `/res/game/${gameId}` });
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
