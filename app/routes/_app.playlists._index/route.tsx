import {
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components";
import { createServerClient, getSession } from "@/services";
import { getCreatedAndFollowedPlaylists } from "@/features/playlists/lib/get-user-playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";

// This route is for personal playlists: followed (public) and
// owned only. Use the explore route for more discovery features
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  if (!session) {
    return redirect("/?index", {
      headers,
    });
  }

  const allPlaylists = await getCreatedAndFollowedPlaylists(session.user.id);

  return typedjson({ allPlaylists, session });
};

export default function PlaylistView() {
  const { allPlaylists } = useTypedLoaderData<typeof loader>();

  return (
    <main className="mt-10">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Games</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPlaylists.map((playlist) => (
              <TableRow key={playlist.id}>
                <TableCell>{playlist.name}</TableCell>
                <TableCell>{playlist.creator.username}</TableCell>
                <TableCell>{playlist.games.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}

// this has column optimisations that might not be ready
