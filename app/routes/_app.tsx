import { auth } from "@/features/auth/helper";
import { Container } from "@/features/layout/container";
import { Navbar } from "@/features/layout/navigation";
import { Sidebar } from "@/features/layout/sidebar";
import { LoaderFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const meta: MetaFunction = () => {
  return [{ title: "playQ" }, { name: "description", content: "What are you playing?" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // We need to get the user's playlists, so we can pass it to the sidebar.
  const userPlaylists = await db.query.playlists.findMany({
    where: eq(playlists.creatorId, session.id),
  })

  return json({ session, userPlaylists });
};


export default function AppLayout() {
  const { session, userPlaylists } = useLoaderData<typeof loader>()
  return (
    <div className="block lg:grid lg:grid-cols-10">
      <div className="col-span-2 hidden h-screen lg:block">
        <Sidebar userId={session.id} playlists={userPlaylists} />
      </div>
      <div className="col-span-8 h-screen">
        <Navbar />
        <Container className="mt-10">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}
