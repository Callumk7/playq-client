import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Input,
	Label,
} from "@/components";
import { getDiscoverablePlaylists } from "@/model";
import { createServerClient, getSession } from "@/services";
import { cap } from "@/util/capitalise";
import { ChevronDownIcon, PersonIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { PlaylistCard } from "./components/playlist-card";
import {
	getHighestRatedPlaylists,
	getPlaylistData,
	getPlaylistWithDiscoveryData,
	getPopularPlaylists,
} from "./loader";
import { PlaylistTableView } from "./components/table-view";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	// Like with popular games, we need a function to get top playlists by followers
	const popularPlaylistIds = await getPopularPlaylists(50);
	const playlistIds = popularPlaylistIds.map((pl) => pl.playlistId);

	const playlistData = await getPlaylistWithDiscoveryData(playlistIds);

	const discoverablePlaylists = await getDiscoverablePlaylists(session.user.id, 10);
	discoverablePlaylists.sort((a, b) => b.followers.length - a.followers.length);

	return typedjson({ playlistData, session });
};

export default function ExplorePlaylists() {
	const { playlistData, session } = useTypedLoaderData<typeof loader>();
	const [isTableView, setIsTableView] = useState<boolean>(true);

	return (
		<main className="flex flex-col gap-4">
			<div className="flex gap-5">
				<SortBox />
				<LimitSelect />
				<form>
					<Label>
						<span>Search</span>
						<Input type="text" name="search" />
					</Label>
				</form>
			</div>
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

function LimitSelect() {
	const [value, setValue] = useState(10);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>{value}</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => setValue(5)}>5</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setValue(10)}>10</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setValue(15)}>15</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setValue(20)}>20</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
