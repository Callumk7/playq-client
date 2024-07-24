import { getCompleteGame } from "@/model/games";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
	Button,
	Comment,
	DBImage,
	GenreTags,
	SaveToCollectionButton,
	Separator,
} from "@/components";
import { GameViewMenubar } from "./components/game-view-menubar";
import { createServerClient, getSession } from "@/services";
import { getUserPlaylists } from "@/features/playlists";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";
import { useState } from "react";
import { GameCommentForm } from "./components/game-comment-form";
import { getGameComments } from "./loading";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { and, eq } from "drizzle-orm";

///
/// LOADER
///
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);
	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const gameId = Number(params.gameId);

	const gamePromise = getCompleteGame(gameId);
	const gameCommentsPromise = getGameComments(gameId);
	const userPlaylistsPromise = getUserPlaylists(session.user.id);
	const collectionDetails = await db.query.usersToGames.findFirst({
		where: and(eq(usersToGames.userId, session.user.id), eq(usersToGames.gameId, gameId)),
	});

	const [game, gameComments, userPlaylists] = await Promise.all([
		gamePromise,
		gameCommentsPromise,
		userPlaylistsPromise,
	]);

	if (!game) {
		return redirect("/");
	}

	return typedjson({ game, userPlaylists, gameComments, session, collectionDetails });
};

export default function GamesRoute() {
	const { game, userPlaylists, gameComments, session, collectionDetails } =
		useTypedLoaderData<typeof loader>();
	const [isCommenting, setIsCommenting] = useState<boolean>(false);

	return (
		<main className="mt-10">
			{game.artworks[0] && (
				<DBImage
					imageId={game.artworks[0].imageId}
					size="1080p"
					className="rounded-2xl"
				/>
			)}
			<div className="flex relative flex-col gap-5">
				<h1 className="pt-4 text-6xl font-semibold">{game.title}</h1>
				<GenreTags genres={game.genres.map((g) => g.genre.name)} />
				<div className="mt-7">
					{collectionDetails ? (
						<GameViewMenubar
							gameId={game.gameId}
							userPlaylists={userPlaylists}
							collectionDetails={collectionDetails}
							userId={session.user.id}
						/>
					) : (
						<SaveToCollectionButton gameId={game.gameId} userId={session.user.id} />
					)}
				</div>
				<Separator />
				<div className="flex gap-5 items-center">
					<h2 className="text-2xl font-semibold">Comments</h2>
					<Button
						variant={"outline"}
						size={"sm"}
						onClick={() => setIsCommenting(!isCommenting)}
					>
						{isCommenting ? "Hide" : "Post a Comment"}
					</Button>
				</div>
				{isCommenting && (
					<GameCommentForm userId={session.user.id} gameId={game.gameId} />
				)}
				{gameComments.map((comment) => (
					<Comment key={comment.id} comment={comment} author={comment.author} />
				))}
			</div>
		</main>
	);
}
