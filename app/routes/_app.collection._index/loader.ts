import { getUserGenres } from "@/features/collection/queries/get-user-genres";
import { getUserPlaylists } from "@/features/playlists";
import { getUserGameCollection } from "@/model";

export const handleDataFetching = async(userId: string) => {
  const userCollectionPromise = getUserGameCollection(userId);
  const userPlaylistsPromise = getUserPlaylists(userId);
  const allUserGenresPromise = getUserGenres(userId);

  const [userCollection, userPlaylists, allGenres] = await Promise.all([
    userCollectionPromise,
    userPlaylistsPromise,
    allUserGenresPromise,
  ]);

	return {
		userCollection, 
		userPlaylists,
		allGenres
	}
}
