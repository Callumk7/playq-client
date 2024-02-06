import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { PlaylistCard } from "@/features/playlists/components/playlist-card";
import { getDiscoverablePlaylists } from "@/features/playlists/lib/get-discoverable-playlists";
import { TableIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  if (!session) {
    // there is no session, therefore, we are redirecting
    // to the landing page. The `/?index` is required here
    // for Remix to correctly call our loaders
    return redirect("/?index", {
      // we still need to return response.headers to attach the set-cookie header
      headers,
    });
  }

  const allPlaylists = await getDiscoverablePlaylists(session.user.id);
  console.log(allPlaylists);

  return typedjson({ allPlaylists });
};

export default function PlaylistView() {
  const { allPlaylists } = useTypedLoaderData<typeof loader>();
  const [isTableView, setIsTableView] = useState(false);

  return (
    <Container>
      <Button size={"icon"} onClick={() => setIsTableView(!isTableView)}>
        <TableIcon />
      </Button>
      {isTableView ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {allPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlistId={playlist.id}
              playlistName={playlist.name}
              games={playlist.games.slice(0, 3).map((p) => p.game)}
              creator={playlist.creator}
            />
          ))}
        </div>
      ) : (
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
      )}
    </Container>
  );
}

// this has column optimisations that might not be ready
