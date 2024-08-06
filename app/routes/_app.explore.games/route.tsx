import { Button, Input, LibraryView } from "@/components";
import { authenticate } from "@/services";
import { ExploreGame } from "@/features/explore/components/search-game";
import { GameListItem } from "@/features/library/components/game-list-item";
import { ListView } from "@/features/library/components/list-view";
import { ArrowLeftIcon, ArrowRightIcon, ViewGridIcon } from "@radix-ui/react-icons";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import {
	typedjson,
	useTypedFetcher,
	useTypedLoaderData,
} from "remix-typedjson";
import { getSearchResults } from "./queries.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);

	const url = new URL(request.url);
	const search = url.searchParams.get("search");
	const offset = url.searchParams.get("offset");

	const resultsMarkedAsSaved = await getSearchResults({
		userId: session.user.id,
		search,
		offset: Number(offset),
	});

	return typedjson({ resultsMarkedAsSaved, session });
};

export default function ExploreRoute() {
	const loaderData = useTypedLoaderData<typeof loader>();
	const fetcher = useTypedFetcher<typeof loader>();
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [data, setData] = useState(loaderData);

	// handling search params
	const [offset, setOffset] = useState<number>(0);

	const formRef = useRef<HTMLFormElement | null>(null);

	const handleIncreaseOffset = () => {
		const newOffset = offset + 50;
		setOffset(newOffset);
	};

	const handleDecreaseOffset = () => {
		const newOffset = offset - 50;
		if (newOffset <= 0) {
			setOffset(0);
		} else {
			setOffset(newOffset);
		}
	};

	// This ensures that we get the new offset value when
	// triggering the fetch.
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run when the offset changes
	useEffect(() => {
		console.log(offset);
		fetcher.submit(formRef.current);
	}, [offset]); // This effect runs whenever 'offset' changes

	useEffect(() => {
		if (fetcher.data !== undefined && fetcher.data !== data) {
			setData(fetcher.data);
		}
	}, [fetcher, data]);

	const [view, setView] = useState<"card" | "list">("list");

	return (
		<div className="mb-12">
			<div className="flex flex-col gap-y-6">
				<div className="flex gap-3">
					<fetcher.Form
						ref={formRef}
						method="get"
						className="flex gap-3"
						onSubmit={() => setOffset(0)}
					>
						<Input
							name="search"
							type="search"
							placeholder="What are you looking for?"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-[360px]" // This needs to be responsive
						/>
						<input type="hidden" value={offset} name="offset" />
						<Button variant={"outline"}>Search</Button>
					</fetcher.Form>
					<Button variant={"outline"}>Advanced Filters</Button>
				</div>
				<div className="flex gap-2">
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => {
							if (view === "card") {
								setView("list");
							} else {
								setView("card");
							}
						}}
					>
						<ViewGridIcon />
					</Button>
					<Button variant={"outline"} size={"icon"} onClick={handleDecreaseOffset}>
						<ArrowLeftIcon />
					</Button>
					<Button variant={"outline"} size={"icon"} onClick={handleIncreaseOffset}>
						<ArrowRightIcon />
					</Button>
				</div>
				{view === "card" ? (
					<LibraryView>
						{data.resultsMarkedAsSaved.map((game) => (
							<ExploreGame
								key={game.id}
								game={game}
								coverId={game.cover.image_id}
								gameId={game.id}
								userId={data.session.user.id}
							/>
						))}
					</LibraryView>
				) : (
					<ListView>
						{data.resultsMarkedAsSaved.map((game) => (
							<GameListItem
								key={game.id}
								gameTitle={game.name}
								gameId={game.id}
								userId={data.session.user.id}
								game={game}
							/>
						))}
					</ListView>
				)}
				<div className="flex gap-2">
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => {
							if (view === "card") {
								setView("list");
							} else {
								setView("card");
							}
						}}
					>
						<ViewGridIcon />
					</Button>
					<Button variant={"outline"} size={"icon"} onClick={handleDecreaseOffset}>
						<ArrowLeftIcon />
					</Button>
					<Button variant={"outline"} size={"icon"} onClick={handleIncreaseOffset}>
						<ArrowRightIcon />
					</Button>
				</div>
			</div>
		</div>
	);
}
