import { useSession } from "@/features/auth/components/session-context";
import { GameCover } from "@/features/library/game-cover";
import { LibraryView } from "@/features/library/library-view";
import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "./_app.playlists.$playlistId";


export default function PlaylistRoute() {
    const { playlistWithGames, allPlaylists } = useTypedLoaderData<typeof loader>();
    const session = useSession();
    return (
        <div>Your session id: {session?.id}</div>
        ,
        <LibraryView>
            {playlistWithGames?.games.map((game) => (
                <GameCover
                    key={game.game.id}
                    coverId={game.game.cover.imageId}
                    gameId={game.gameId}
                    playlists={allPlaylists}
                >
                    Controls
                </GameCover>
            ))}
        </LibraryView>
    );
}

