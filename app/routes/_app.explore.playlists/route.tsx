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

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const discoverablePlaylists = await getDiscoverablePlaylists(session.user.id);

	return typedjson({ discoverablePlaylists, session });
};

export default function ExplorePlaylists() {
	const { discoverablePlaylists, session } = useTypedLoaderData<typeof loader>();

	return (
		<main className="flex flex-col gap-4">
			<div className="flex gap-5">
				<SortBox />
				<form>
					<Label>
						<span>Search</span>
						<Input type="text" name="search" />
					</Label>
				</form>
			</div>
			<div className="grid gap-3">
				{discoverablePlaylists.map((playlist) => (
					<PlaylistCard
						playlist={playlist}
						userId={session.user.id}
						key={playlist.id}
						games={playlist.games.slice(0, 4).map((g) => g.game)}
						creator={playlist.creator}
					/>
				))}
			</div>
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
