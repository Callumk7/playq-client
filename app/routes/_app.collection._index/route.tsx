import { RateGameDialog } from "@/components";
import { getUserPlaylists } from "@/features/playlists";
import {
	getUserGamesWithDetails,
	getUserGenres,
	transformCollectionIntoGames,
} from "@/model";
import { createServerClient, getSession } from "@/services";
import { GameWithCollection } from "@/types";
import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";

import { CollectionView } from "./components/CollectionView";
import { useHandleRateGameDialog } from "./hooks/rate-game-dialog";

///
/// LOADER FUNCTION
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);
	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const userCollectionPromise = getUserGamesWithDetails(session.user.id);
	const userPlaylistsPromise = getUserPlaylists(session.user.id);
	const allUserGenresPromise = getUserGenres(session.user.id);

	const [userCollection, userPlaylists, userGenres] = await Promise.all([
		userCollectionPromise,
		userPlaylistsPromise,
		allUserGenresPromise,
	]);

	// Not sure about this transform function. At this point, it might be too
	// arbitrary. Consider the data needs and review at a later date.
	const games: GameWithCollection[] = transformCollectionIntoGames(userCollection);
	const genreNames = userGenres.map((genre) => genre.name);

	return typedjson({ session, userPlaylists, games, genreNames });
};

///
/// ROUTE
///
export default function CollectionIndex() {
	const { userPlaylists, games, session, genreNames } =
		useTypedLoaderData<typeof loader>();

	const {
		isRateGameDialogOpen,
		setIsRateGameDialogOpen,
		dialogGameId,
		handleOpenRateGameDialog,
	} = useHandleRateGameDialog();

	return (
		<>
			<CollectionView
				games={games}
				userPlaylists={userPlaylists}
				userId={session.user.id}
				genreNames={genreNames}
				handleOpenRateGameDialog={handleOpenRateGameDialog}
			/>
			<RateGameDialog
				userId={session.user.id}
				gameId={dialogGameId}
				isRateGameDialogOpen={isRateGameDialogOpen}
				setIsRateDialogOpen={setIsRateGameDialogOpen}
			/>
		</>
	);
}
