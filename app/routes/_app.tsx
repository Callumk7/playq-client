import { auth } from "@/features/auth/helper";
import { Container } from "@/features/layout/container";
import { Navbar } from "@/features/layout/navigation";
import { Sidebar } from "@/features/layout/sidebar";
import { CreatePlaylistDialog } from "@/features/playlists/components/create-playlist-dialog";
import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Outlet } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { SessionContext } from "@/features/auth/components/session-context";

export const meta: MetaFunction = () => {
  return [{ title: "playQ" }, { name: "description", content: "What are you playing?" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // We need to get the user's playlists, so we can pass it to the sidebar.
  const userPlaylists = await db.query.playlists.findMany({
    where: eq(playlists.creatorId, session.id),
  });

  return typedjson({ session, userPlaylists });
};

export default function AppLayout() {
  const { session, userPlaylists } = useTypedLoaderData<typeof loader>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="block lg:grid lg:grid-cols-10 h-full min-h-screen">
        <div className="col-span-2 hidden h-full min-h-screen lg:block">
          <Sidebar playlists={userPlaylists} setDialogOpen={setDialogOpen} />
        </div>
        <div className="col-span-8 h-full">
          <Navbar />
          <Container className="mt-10">
            <SessionContext.Provider value={session}>
              <Outlet />
            </SessionContext.Provider>
          </Container>
        </div>
      </div>
      <CreatePlaylistDialog
        userId={session.id}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}
