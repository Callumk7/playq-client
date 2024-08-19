import { Container, GameCover, Label, LibraryView, Progress, Toggle } from "@/components";
import {
	genresToStrings,
	getAllGenres,
} from "@/features/collection/queries/get-user-genres";
import { SaveToCollectionButton } from "@/features/explore";
import { authenticate } from "@/services";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import {
	getPopularGames,
} from "./queries.server";
import { useAppData } from "../_app/route";
import { RatedGameCard } from "./components/rated-game-card";
import { useTypedLoaderData, typedjson } from "remix-typedjson";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);

	const allGenres = await getAllGenres();
	const genreStrings = genresToStrings(allGenres);
	genreStrings.forEach((s, i) => {
		genreStrings[i] = s.toLowerCase();
	});

	const { topTenByRating, popularGames, maxCollectionCount, maxPlaylistCount } =
		await getPopularGames(25);

	return typedjson({
		session,
		topTenByRating,
		popularGames,
		maxPlaylistCount,
		maxCollectionCount,
	});
};

export default function PopularExplore() {
	const { session, topTenByRating, popularGames, maxCollectionCount, maxPlaylistCount } =
		useTypedLoaderData<typeof loader>();

	const { userCollectionIds } = useAppData();

	const [sortBy, setSortBy] = useState<"collection" | "playlist">("collection");
	const sortByCollection = sortBy === "collection";

	const handleToggleSortBy = () => {
		if (sortBy === "collection") {
			popularGames.sort((a, b) => b.playlistCount - a.playlistCount);
			setSortBy("playlist");
		} else {
			popularGames.sort((a, b) => b.collectionCount - a.collectionCount);
			setSortBy("collection");
		}
	};

	return (
		<Container className="space-y-6">
			<h2 className="text-xl font-bold">Top Rated Games</h2>
			<LibraryView>
				{topTenByRating.map((game) => (
					<RatedGameCard
						userId={session.user.id}
						key={game.id}
						game={game}
						avRating={Number(game.avRating)}
						ratingCount={game.ratingCount}
					/>
				))}
			</LibraryView>
			<Toggle pressed={sortByCollection} onPressedChange={handleToggleSortBy}>
				{sortBy === "collection" ? "Collection Popularity" : "Playlist Popularity"}
			</Toggle>
			<LibraryView>
				{popularGames.map((game) => (
					<div key={game.id} className="flex relative flex-col gap-3">
						{!userCollectionIds.includes(game.gameId) && (
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
