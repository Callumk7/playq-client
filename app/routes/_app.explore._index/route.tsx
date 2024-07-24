import { Container, GameCover, Label, LibraryView, Progress, Toggle } from "@/components";
import {
	genresToStrings,
	getAllGenres,
} from "@/features/collection/queries/get-user-genres";
import { SaveToCollectionButton } from "@/features/explore";
import {
	combinePopularGameData,
	getPopularGamesByCollection,
	getPopularGamesByPlaylist,
} from "@/features/home/queries/popular-games";
import { getUserCollectionGameIds } from "@/model";
import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getTopTenByRating, getTopTenByRatingCount } from "./loading";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/login");
	}

	const popularGamesByPlaylistPromise = getPopularGamesByPlaylist();
	const popularGamesByCollectionPromise = getPopularGamesByCollection();
	const userCollectionGameidsPromise = getUserCollectionGameIds(session.user.id);
	const allGenres = await getAllGenres();
	const genreStrings = genresToStrings(allGenres);
	genreStrings.forEach((s, i) => {
		genreStrings[i] = s.toLowerCase();
	});

	// fetch gameIds in parallel
	const [popularGamesByCollection, popularGamesByPlaylist, userCollectionGameIds] =
		await Promise.all([
			popularGamesByCollectionPromise,
			popularGamesByPlaylistPromise,
			userCollectionGameidsPromise,
		]);

	// WARN: this actually has missing data because each list may (and wont) contain the same
	// games. I need to either cache two lists, or change the logic so that only shared games are fetched
	const processedData = await combinePopularGameData({
		popularGamesByCollection,
		popularGamesByPlaylist,
	});

	const topTenGames = await getTopTenByRating();
	const topTenGamesByCount = await getTopTenByRatingCount();

	return json(
		{
			processedData,
			userCollectionGameIds,
			session,
			genreStrings,
			topTenGames,
			topTenGamesByCount,
		},
		{ headers },
	);
};

export default function PopularExplore() {
	const {
		processedData,
		userCollectionGameIds,
		session,
		genreStrings,
		topTenGames,
		topTenGamesByCount,
	} = useLoaderData<typeof loader>();
	// This could be done on the server..
	const maxCollectionCount = processedData.reduce(
		(max, game) => Math.max(max, game.collectionCount),
		0,
	);
	const maxPlaylistCount = processedData.reduce(
		(max, game) => Math.max(max, game.playlistCount),
		0,
	);

	const [sortBy, setSortBy] = useState<"collection" | "playlist">("collection");
	const sortByCollection = sortBy === "collection";

	const handleToggleSortBy = () => {
		if (sortBy === "collection") {
			processedData.sort((a, b) => b.playlistCount - a.playlistCount);
			setSortBy("playlist");
		} else {
			processedData.sort((a, b) => b.collectionCount - a.collectionCount);
			setSortBy("collection");
		}
	};

	return (
		<Container className="space-y-6">
			<h2 className="text-xl font-bold">Top 10 Games</h2>
			<LibraryView>
				{topTenGamesByCount.map((game) => (
					<div key={game.id} className="flex flex-col gap-3">
						<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
						<div className="p-3 rounded-md border">
							<span className="text-lg font-black">
								{Math.floor(Number(game.avRating))}{" "}
								<span className="text-xs font-light text-foreground-muted">
									av. rating
								</span>
							</span>
							<div>
								<span className="text-xs">/</span>
								<span>{game.ratingCount}</span>{" "}
								<span className="text-xs font-light text-foreground-muted">users</span>
							</div>
						</div>
					</div>
				))}
			</LibraryView>
			<Toggle pressed={sortByCollection} onPressedChange={handleToggleSortBy}>
				{sortBy === "collection" ? "Collection Popularity" : "Playlist Popularity"}
			</Toggle>
			<LibraryView>
				{processedData.map((game) => (
					<div key={game.id} className="flex relative flex-col gap-3">
						{!userCollectionGameIds.includes(game.gameId) && (
							<div className="absolute top-3 right-3 z-20">
								<SaveToCollectionButton
									variant="outline"
									gameId={game.gameId}
									userId={session.user.id}
								/>
							</div>
						)}
						<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
						<ExploreGameDataRow
							collectionCount={game.collectionCount}
							maxCollectionCount={maxCollectionCount}
							playlistCount={game.playlistCount}
							maxPlaylistCount={maxPlaylistCount}
						/>
					</div>
				))}
			</LibraryView>
		</Container>
	);
}

interface ExploreGameDataRowProps {
	collectionCount: number;
	maxCollectionCount: number;
	playlistCount: number;
	maxPlaylistCount: number;
}
function ExploreGameDataRow({
	collectionCount,
	playlistCount,
	maxCollectionCount,
	maxPlaylistCount,
}: ExploreGameDataRowProps) {
	return (
		<div className="flex flex-col gap-2 p-3 rounded-md border">
			<div className="flex flex-col gap-1 w-full">
				<Label>Collection Popularity</Label>
				<Progress value={collectionCount} max={maxCollectionCount} className="h-2" />
			</div>
			<div className="flex flex-col gap-1 w-full">
				<Label>Playlist Popularity</Label>
				<Progress value={playlistCount} max={maxPlaylistCount} className="h-2" />
			</div>
		</div>
	);
}
