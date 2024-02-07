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
    return redirect("/?index", {
      headers,
    });
  }

  const discoverablePlaylists = await getDiscoverablePlaylists(session.user.id);
  console.log(discoverablePlaylists);

  return typedjson({ discoverablePlaylists, session });
};

export default function ExplorePlaylists() {
  const { discoverablePlaylists, session } = useTypedLoaderData<typeof loader>();
  const [isTableView, setIsTableView] = useState(false);

  return (
    <Container>
      <Button size={"icon"} onClick={() => setIsTableView(!isTableView)}>
        <TableIcon />
      </Button>
      {isTableView ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {discoverablePlaylists.map((playlist) => (
            <PlaylistCard
              userId={session.user.id}
              key={playlist.id}
              playlistId={playlist.id}
              playlistName={playlist.name}
              games={playlist.games.slice(0, 4).map(g => g.game)}
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
            {discoverablePlaylists.map((playlist) => (
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
