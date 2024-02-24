import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Outlet, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { CreatePlaylistDialog } from "@/features/playlists";
import { createServerClient, getSession } from "@/services";
import { createBrowserClient } from "@supabase/ssr";
import { useUserCacheStore } from "@/store/cache";
import { getFriendActivity, getUserCollectionGameIds, transformActivity } from "@/model";
import { Container, Navbar, Sidebar } from "@/components";
import { Playlist, User, UserWithActivity } from "@/types";
import {
	getCreatedAndFollowedPlaylists,
	getUserFriends,
} from "./loader";

export const meta: MetaFunction = () => {
	return [{ title: "playQ" }, { name: "description", content: "What are you playing?" }];
};

// We are going to use this base route for supabase authentication. This is also where
// we define the basic layout, including navigation bar and sidebar.
export const loader = async ({ request }: LoaderFunctionArgs) => {
	// env variables that we need on the browser:
	const ENV = {
		SUPABASE_URL: process.env.SUPABASE_URL!,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
	};

	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	let userPlaylists: Playlist[] = [];
	let userFriends: User[] = [];
	let userCollection: number[] = [];
	let friendActivity: UserWithActivity[] = [];
	if (session) {
		userPlaylists = await getCreatedAndFollowedPlaylists(session.user.id);
		userFriends = await getUserFriends(session.user.id);
		friendActivity = await getFriendActivity(session.user.id);

		// Set the store for user gameIds as a cache on the app route.
		userCollection = await getUserCollectionGameIds(session.user.id);
	}

	const activityFeed = transformActivity(friendActivity);

	return typedjson(
		{ ENV, session, userPlaylists, userFriends, userCollection, activityFeed },
		{ headers },
	);
};

export default function AppLayout() {
	const { ENV, session, userPlaylists, userFriends, userCollection, activityFeed } =
		useTypedLoaderData<typeof loader>();
	// set the store for use around the app
	const setUserCollection = useUserCacheStore((state) => state.setUserCollection);
	const setUserFriends = useUserCacheStore((state) => state.setUserFriends);
	const setUserPlaylists = useUserCacheStore((state) => state.setUserPlaylists);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on render
	useEffect(() => {
		setUserCollection(userCollection);
		setUserFriends(userFriends.map((friend) => friend.id));
		setUserPlaylists(userPlaylists.map((playlist) => playlist.id));
	}, []);

	// supabase data requests
	const supaFetcher = useFetcher();

	// We create a single instance of Supabase to use across client components
	const [supabase] = useState(() =>
		createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY),
	);

	const [dialogOpen, setDialogOpen] = useState<boolean>(false);

	const serverAccessToken = session?.access_token;

	// This is all from the Remix example from supabase:
	// https://github.com/supabase/auth-helpers/blob/main/examples/remix
	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.access_token !== serverAccessToken && supaFetcher.state === "idle") {
				// server and client are out of sync.
				// Remix recalls active loaders after actions are complete
				supaFetcher.submit(null, {
					method: "POST",
					action: "/handle-supabase-auth",
				});
			}
		});

		return () => subscription.unsubscribe();
	}, [serverAccessToken, supabase, supaFetcher]);

	return (
		<>
			<div className="h-full min-h-screen lg:flex-grow">
				<div className="fixed hidden h-full min-h-screen w-64 lg:block">
					<Sidebar
						userId={session!.user.id}
						playlists={userPlaylists}
						setDialogOpen={setDialogOpen}
						hasSession={session ? true : false}
						activityFeed={activityFeed}
					/>
				</div>
				<div className="h-full lg:pl-64">
					<Navbar supabase={supabase} session={session} />
					<Container className="mt-20 md:mt-0">
						<Outlet />
					</Container>
				</div>
			</div>
			{session && (
				<CreatePlaylistDialog
					userId={session.user.id}
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
				/>
			)}
		</>
	);
}
