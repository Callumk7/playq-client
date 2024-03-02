import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components";
import { createServerClient, getSession } from "@/services";
import { cap } from "@/util/capitalise";
import { ChevronDownIcon, PersonIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { PlaylistCard } from "./components/playlist-card";
import { getPlaylistWithDiscoveryData, getPopularPlaylists } from "./loader";
import { PlaylistTableView } from "./components/table-view";
import { useFetcher } from "@remix-run/react";
import { PaginationAndLimit } from "@/components/explore/pagination";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const url = new URL(request.url);
	const searchParams = url.searchParams;
	const offset = Number(searchParams.get("offset"));
	let limit: number;
	if (searchParams.get("limit")) {
		limit = Number(searchParams.get("limit"));
	} else {
		limit = 50;
	}

	// Like with popular games, we need a function to get top playlists by followers
	const popularPlaylistIds = await getPopularPlaylists(limit, offset);
	const playlistIds = popularPlaylistIds.map((pl) => pl.playlistId);

	const playlistData = await getPlaylistWithDiscoveryData(playlistIds);
	playlistData.sort((a, b) => b.followerCount - a.followerCount);

	return typedjson({ playlistData, session });
};

export default function ExplorePlaylists() {
	const { playlistData, session } = useTypedLoaderData<typeof loader>();

	const [isTableView, setIsTableView] = useState<boolean>(true);

	const searchFetcher = useFetcher<typeof loader>();

	return (
		<main className="flex flex-col gap-4">
			<PaginationAndLimit />
			{isTableView ? (
				<PlaylistTableView playlists={playlistData} />
			) : (
				<div className="grid gap-3">
					{playlistData.map((playlist) => (
						<PlaylistCard
							playlist={playlist}
							userId={session.user.id}
							key={playlist.id}
							games={playlist.games.slice(0, 4).map((g) => g.game)}
							creator={playlist.creator}
						/>
					))}
				</div>
			)}
		</main>
	);
}

function SortBox() {
	const [sortOrder, setSortOrder] = useState<"rating" | "follows">("rating");
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="w-28">
					<span className="mr-3">{cap(sortOrder)}</span> <ChevronDownIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => setSortOrder("follows")}>
					<PersonIcon className="mr-3" />
					<span>Follows</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setSortOrder("rating")}>
					<StarFilledIcon className="mr-3" />
					<span>Rating</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
