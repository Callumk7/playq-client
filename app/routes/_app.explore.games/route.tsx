import { Button, Input, LibraryView, Toggle } from "@/components";
import { authenticate } from "@/services";
import { ExploreGame } from "@/features/explore/components/search-game";
import { GameListItem } from "@/features/library/components/game-list-item";
import { ListView } from "@/features/library/components/list-view";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getSearchResultsNew, getTopRatedRecentGames } from "./queries.server";
import { Form, useLoaderData, useSearchParams, useSubmit } from "@remix-run/react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { GridIcon } from "@radix-ui/react-icons";

function getSearchParams(urlString: string) {
	const url = new URL(urlString);
	const search = url.searchParams.get("search");
	const page = url.searchParams.get("page");

	return {
		search,
		page,
	};
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);
	const { search, page } = getSearchParams(request.url);

	const searchResults = await getSearchResultsNew(search, page);

	return typedjson({ searchResults, session });
};

export default function ExploreRoute() {
	const { session } = useLoaderData<typeof loader>();
	const [view, setView] = useState<"card" | "list">("list");

	return (
		<div className="mb-12">
			<div className="flex flex-col gap-y-6">
				<GameSearch setView={setView} />
				<ResultsView view={view} userId={session.user.id} />
				<SearchControls />
			</div>
		</div>
	);
}

function GameSearch(props: { setView: (view: "card" | "list") => void }) {
	return (
		<div className="flex gap-3">
			<Form className="flex gap-3">
				<Input
					name="search"
					type="search"
					placeholder="What are you looking for?"
					className="w-[360px]" // This needs to be responsive
				/>
				<Button variant={"outline"}>Search</Button>
			</Form>
			<Button variant={"outline"}>Advanced Filters</Button>
			<Toggle
				variant={"outline"}
				onPressedChange={(pressed) => props.setView(pressed ? "card" : "list")}
			>
				<GridIcon />
			</Toggle>
		</div>
	);
}

function SearchControls() {
	const [searchParams] = useSearchParams();
	const search = searchParams.get("search");
	let page = Number(searchParams.get("page"));
	if (!page) page = 1;
	let queryString = "?";
	if (search) queryString += `search=${search}`;

	return (
		<Pagination>
			<PaginationContent>
				{page > 1 && (
					<PaginationItem>
						<PaginationPrevious to={`${queryString}&page=${page - 1}`} />
					</PaginationItem>
				)}
				<PaginationItem>
					<PaginationNext to={`${queryString}&page=${page + 1}`} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

function ResultsView(props: { view: "card" | "list"; userId: string }) {
	const { view, userId } = props;
	const loaderData = useTypedLoaderData<typeof loader>();
	return (
		<>
			{view === "card" ? (
				<LibraryView>
					{loaderData.searchResults.map((game) => (
						<ExploreGame
							key={game.id}
							game={game}
							coverId={game.cover.image_id}
							gameId={game.id}
							userId={userId}
						/>
					))}
				</LibraryView>
			) : (
				<ListView>
					{loaderData.searchResults.map((game) => (
						<GameListItem
							key={game.id}
							gameTitle={game.name}
							gameId={game.id}
							userId={userId}
							game={game}
						/>
					))}
				</ListView>
			)}
		</>
	);
}
