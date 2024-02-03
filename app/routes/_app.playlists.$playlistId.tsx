import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { createServerClient, getSession } from "@/features/auth";
import { getUserGameCollection } from "@/features/collection";
import { GameCover, LibraryView } from "@/features/library";
import { getPlaylistWithGames } from "@/features/playlists";
import { PlaylistMenubar } from "@/features/playlists/components/playlist-menubar";
import { Game } from "@/types/games";
import { PlaylistWithGames } from "@/types/playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";

// Type guard types
interface Blocked {
  blocked: true;
}

interface Result {
  blocked: false;
  playlistWithGames: PlaylistWithGames;
  usersGames: Game[];
}

///
/// LOADER
///
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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

  const { playlistId } = zx.parseParams(params, {
    playlistId: z.string(),
  });

  // We need to do some checks to see what permissions the user has for this
  // specific playlist.
  const minPlaylistData = await db
    .select({
      creator: playlists.creatorId,
      isPrivate: playlists.isPrivate,
    })
    .from(playlists)
    .where(eq(playlists.id, playlistId));

  // if creator != user & isPrivate
  if (minPlaylistData[0].creator !== session.user.id && minPlaylistData[0].isPrivate) {
    return typedjson({ blocked: true });
  }

  const playlistWithGamesPromise = getPlaylistWithGames(playlistId);
  const userCollectionPromise = getUserGameCollection(session.user.id);

  const [playlistWithGames, userCollection] = await Promise.all([
    playlistWithGamesPromise,
    userCollectionPromise,
  ]);

  const usersGames = userCollection.map(c => c.game)

  return typedjson({ playlistWithGames, usersGames, blocked: false });
};

///
/// ROUTE
///
export default function PlaylistRoute() {
  const result = useTypedLoaderData<Blocked | Result>();
  const rename = useFetcher();
  const isSubmitting = rename.state === "submitting";

  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>();
  const [deletePlaylistDialogOpen, setDeletePlaylistDialogOpen] = useState<boolean>();

  useEffect(() => {
    if (isSubmitting && renameDialogOpen) {
      setRenameDialogOpen(false);
    }
  }, [isSubmitting, renameDialogOpen, setRenameDialogOpen]);

  if (result.blocked) {
    return <div>This Playlist is Private</div>;
  }

  const { playlistWithGames, usersGames } = result;

  return (
    <>
      <div>
        <div className="flex gap-7">
          <PlaylistMenubar
            isPrivate={playlistWithGames.isPrivate}
            games={usersGames}
            playlistId={playlistWithGames.id}
            userId={playlistWithGames.creatorId}
            setRenameDialogOpen={setRenameDialogOpen}
            setDeletePlaylistDialogOpen={setDeletePlaylistDialogOpen}
          />
          {playlistWithGames?.isPrivate && (
            <Button disabled variant={"outline"} size={"sm"}>
              is private
            </Button>
          )}
        </div>
        <h1 className="mt-5 py-2 text-3xl font-semibold">{playlistWithGames?.name}</h1>
        <Separator />
        <LibraryView>
          {playlistWithGames?.games.map((game) => (
            <GameCover
              key={game.game.id}
              coverId={game.game.cover.imageId}
              gameId={game.gameId}
            />
          ))}
        </LibraryView>
      </div>
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose a new name</DialogTitle>
          </DialogHeader>
          <rename.Form method="PATCH" action={`/api/playlists/${playlistWithGames.id}`}>
            <Input name="playlistName" type="text" />
          </rename.Form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={deletePlaylistDialogOpen}
        onOpenChange={setDeletePlaylistDialogOpen}
        modal={true}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure that you really want to delete this playlist?
            </DialogTitle>
            <DialogDescription>
              Once you delete a playlist it is impossible to recover. All saved games will
              be lost to the void forever.
            </DialogDescription>
          </DialogHeader>
          <Form method="delete" action={`/api/playlists/${playlistWithGames.id}`}>
            <DialogFooter>
              <Button variant={"destructive"}>Delete</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
