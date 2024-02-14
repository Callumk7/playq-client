import { getCompleteGame } from "@/model/games";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	DBImage,
	GenreTags,
	Separator,
} from "@/components";
import { GameViewMenubar } from "./components/game-view-menubar";
import { createServerClient, getSession } from "@/services";
import { getUserPlaylists } from "@/features/playlists";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";

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

	// TODO: make these parallel
	const game = await getCompleteGame(gameId);
	const userPlaylists = await getUserPlaylists(session.user.id);

	if (!game) {
		return redirect("/");
	}

	return typedjson({ game, userPlaylists });
};

export default function GamesRoute() {
	const { game, userPlaylists } = useTypedLoaderData<typeof loader>();
	return (
		<main className="mt-10">
			<DBImage imageId={game.artworks[0].imageId} size="1080p" className="rounded-2xl" />
			<div className="relative flex flex-col gap-5">
				<h1 className="pt-4 text-6xl font-semibold">{game.title}</h1>
				<GenreTags genres={game.genres.map((g) => g.genre.name)} />
				<div className="mt-7">
					<GameViewMenubar gameId={game.gameId} userPlaylists={userPlaylists} />
				</div>
				<Separator />
			</div>
		</main>
	);
}
