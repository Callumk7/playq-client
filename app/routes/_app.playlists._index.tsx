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
import { PlaylistCard } from "@/features/playlists/components/playlist-card";
import { getCreatedAndFollowedPlaylists } from "@/features/playlists/lib/get-user-playlists";
import { TableIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
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

  const allPlaylists = await getCreatedAndFollowedPlaylists(session.user.id)

  return typedjson({ allPlaylists, session });
};

export default function PlaylistView() {
  const { allPlaylists, session } = useTypedLoaderData<typeof loader>();
  const [isTableView, setIsTableView] = useState(false);

  return (
    <div>
      <Button size={"icon"} onClick={() => setIsTableView(!isTableView)}>
        <TableIcon />
      </Button>
      {isTableView ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {allPlaylists.map((playlist) => (
            <PlaylistCard
              userId={session.user.id}
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
    </div>
  );
}

// this has column optimisations that might not be ready
