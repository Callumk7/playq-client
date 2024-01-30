import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { createServerClient, getSession } from "@/features/auth";
import {
  combinePopularGameData,
  getPopularGamesByCollection,
  getPopularGamesByPlaylist,
} from "@/features/home/queries/popular-games";
import { Container } from "@/features/layout";
import { LibraryView } from "@/features/library";
import { GameCover } from "@/features/library/components/game-cover";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  if (!session) {
    return redirect("/login");
  }

  const popularGamesByPlaylistPromise = getPopularGamesByPlaylist();
  const popularGamesByCollectionPromise = getPopularGamesByCollection();

  // fetch gameIds in parallel
  const [popularGamesByCollection, popularGamesByPlaylist] = await Promise.all([
    popularGamesByCollectionPromise,
    popularGamesByPlaylistPromise,
  ]);

  // I should create an explcit type for the return type of this function
  const processedData = await combinePopularGameData({
    popularGamesByCollection,
    popularGamesByPlaylist,
  });

  return json({ processedData }, { headers });
};

export default function AppIndex() {
  const { processedData } = useLoaderData<typeof loader>();
  const maxCollectionCount = processedData.reduce(
    (max, game) => Math.max(max, game.collectionCount),
    0,
  );
  console.log(maxCollectionCount)
  const maxPlaylistCount = processedData.reduce(
    (max, game) => Math.max(max, game.playlistCount),
    0,
  );
  console.log(maxPlaylistCount)
  return (
    <Container>
      <LibraryView>
        {processedData.map((game) => (
          <div key={game.id} className="flex flex-col gap-3">
            <GameCover coverId={game.cover.imageId} />
            <ExploreGameDataRow
              collectionCount={game.collectionCount}
              maxCollectionCount={maxCollectionCount}
              playlistCount={game.playlistCount}
              maxPlaylistCount={maxPlaylistCount}
            />
          </div>
        ))}
      </LibraryView>
    </Container>
  );
}

interface ExploreGameDataRowProps {
  collectionCount: number;
  maxCollectionCount: number;
  playlistCount: number;
  maxPlaylistCount: number;
}

function ExploreGameDataRow({
  collectionCount,
  playlistCount,
  maxCollectionCount,
  maxPlaylistCount,
}: ExploreGameDataRowProps) {
  return (
    <div className="rounded-md border p-3 flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-2 items-center">
        <Label className="col-span-1 text-right">Collection Popularity</Label>
        <Progress value={collectionCount} max={maxCollectionCount} className="h-2 col-span-3" />
      </div>
      <div className="grid grid-cols-4 gap-2 items-center">
        <Label className="col-span-1 text-right">Playlist Popularity</Label>
        <Progress value={playlistCount} max={maxPlaylistCount} className="h-2 col-span-3" />
      </div>
    </div>
  );
}
