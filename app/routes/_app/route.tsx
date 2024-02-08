import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Outlet, useFetcher } from "@remix-run/react";
import { db } from "db";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { CreatePlaylistDialog } from "@/features/playlists";
import { createServerClient } from "@/features/auth/supabase/supabase.server";
import { Playlist } from "@/types/playlists";
import { createBrowserClient } from "@supabase/ssr";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { User } from "@/types/users";
import { friends } from "db/schema/users";
import { useCollectionStore } from "@/store/collection";
import { getCreatedAndFollowedPlaylists } from "@/features/playlists/lib/get-user-playlists";
import { getUserCollectionGameIds } from "@/model";
import { Container, Navbar, Sidebar } from "@/components";

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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userPlaylists: Playlist[] = [];
  let userFriends: User[] = [];
  let userCollection: number[] = [];
  if (session) {
    userPlaylists = await getCreatedAndFollowedPlaylists(session.user.id)
    userFriends = await db.query.friends
      .findMany({
        where: eq(friends.userId, session.user.id),
        with: {
          friend: true,
        },
      })
      .then((results) => results.map((result) => result.friend));

    // Set the store for user gameIds as a cache on the app route.
    userCollection = await getUserCollectionGameIds(session.user.id);
  }

  return typedjson(
    { ENV, session, userPlaylists, userFriends, userCollection },
    { headers },
  );
};

export default function AppLayout() {
  const { ENV, session, userPlaylists, userFriends, userCollection } =
    useTypedLoaderData<typeof loader>();
  // set the store for use around the app
  const setUserCollection = useCollectionStore((state) => state.setUserCollection);
  setUserCollection(userCollection);

  // supabase data requests
  const supaFetcher = useFetcher();

  // fetcher for dragging games to a playlist
  const playlistFetcher = useFetcher();

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

  // dnd kit, drop event. This controls specifically games being dragged into a playlist
  const handleDrop = (e: DragEndEvent) => {
    if (e.over) {
      // once we end the drag.. we want to trigger a fetcher
      playlistFetcher.submit(
        { addedBy: session!.user.id },
        {
          method: "POST",
          action: `/api/playlists/${e.over.id}/games/${e.active.id}`,
        },
      );
    }
  };

  return (
    <>
      <DndContext onDragEnd={handleDrop}>
        <div className="h-full min-h-screen lg:flex-grow">
          <div className="fixed hidden w-64 h-full min-h-screen lg:block">
            <Sidebar
              userId={session!.user.id}
              playlists={userPlaylists}
              friends={userFriends}
              setDialogOpen={setDialogOpen}
              hasSession={session ? true : false}
            />
          </div>
          <div className="h-full lg:pl-64">
            <Navbar supabase={supabase} session={session} />
            <Container>
              <Outlet />
            </Container>
          </div>
        </div>
      </DndContext>
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