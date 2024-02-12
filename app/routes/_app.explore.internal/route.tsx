import {
	Button,
	Input,
	Label,
	LibraryView,
	Slider,
	GenreFilter,
	GenreToggles,
} from "@/components";
import { createServerClient, getSession } from "@/services";
import { getAllGenres } from "@/features/collection/queries/get-user-genres";
import { ExploreGameInternal } from "@/features/explore/components/search-game";
import { useRouteData } from "@/features/explore/hooks/use-initial-data";
import { markInternalResultsAsSaved } from "@/features/explore/lib/mark-results-as-saved";
import { getUserCollectionGameIds } from "@/model";
import { useExploreStore } from "@/store/explore";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { covers, games, genres, genresToGames } from "db/schema/games";
import { eq, ilike, inArray, and, gt } from "drizzle-orm";
import { redirect, typedjson } from "remix-typedjson";
import { getSearchResultsFromDb } from "./loader";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// AUTH
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);
	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	// use the URL for shared state.
	const url = new URL(request.url);
	const search = url.searchParams.get("search");
	const genreSearch = url.searchParams.getAll("genres");
	const rating = Number(url.searchParams.get("rating") ?? 80);
	const follows = Number(url.searchParams.get("follows") ?? 50);

	const conditions = [gt(games.externalFollows, follows), gt(games.rating, rating)];

	if (search) conditions.push(ilike(games.title, `%${search}%`));
	if (genreSearch.length > 0) conditions.push(inArray(genres.name, genreSearch));

	const searchResults = await getSearchResultsFromDb(conditions);
	// this mutates the shape of the result
	const gameIds = await getUserCollectionGameIds(session.user.id);
	const resultsMarkedAsSaved = markInternalResultsAsSaved(searchResults, gameIds);

	const allGenres = await getAllGenres();
	const genreNames = allGenres.map((g) => g.name);

	return typedjson({ resultsMarkedAsSaved, session, genreNames });
};

export default function ExploreRoute() {
	const { data, fetcher } = useRouteData<typeof loader>();

	// We are filtering on the results, and the filter state is kept in the store
	const store = useExploreStore();

	return (
		<div className="mb-12">
			<div className="flex flex-col gap-y-6">
				<fetcher.Form method="get" className="flex flex-col gap-3 w-3/4">
					<Label>Title</Label>
					<Input name="search" type="search" placeholder="What are you looking for?" />
					{store.genreFilter.map((g) => (
						<input key={g} type="hidden" name="genres" value={g} />
					))}
					<div className="flex gap-4">
						<Button type="submit">Search</Button>
						<Button variant={"outline"} type="button" onClick={store.toggleShowFilters}>
							Advanced Filters
						</Button>
					</div>
					{store.showFilters && (
						<>
							<GenreToggles
								genres={data.genreNames}
								genreFilter={store.genreFilter}
								handleGenreToggled={store.handleGenreToggled}
								handleToggleAllGenres={store.handleToggleAllGenres}
							/>
							<Label>Rating</Label>
							<Slider name="rating" defaultValue={[80]} />
							<Label>Follows</Label>
							<Slider name="follows" defaultValue={[50]} />
						</>
					)}
				</fetcher.Form>
				<LibraryView>
					{data.resultsMarkedAsSaved.map((result) => (
						<ExploreGameInternal
							key={result.games.id}
							game={{
								...result.games,
								cover: result.covers!,
								saved: result.saved,
							}}
							userId={data.session.user.id}
						/>
					))}
				</LibraryView>
			</div>
		</div>
	);
}
