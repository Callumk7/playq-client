import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserCacheStore {
	userCollection: number[];
	userPlaylists: string[];
	userFriends: string[];
	setUserCollection: (userCollection: number[]) => void;
	appendToUserCollection: (gameId: number) => void;
	removeFromUserCollection: (gameId: number) => void;
	setUserFriends: (userFriends: string[]) => void;
	appendFriend: (friendId: string) => void;
	removeFriend: (friendId: string) => void;
	setUserPlaylists: (userPlaylists: string[]) => void;
	appendToUserPlaylists: (playlistId: string) => void;
	removeFromUserPlaylists: (playlistId: string) => void;
}

export const useUserCacheStore = create<UserCacheStore>()(
	devtools((set) => ({
		userCollection: [],
		userFriends: [],
		userPlaylists: [],
		setUserCollection: (userCollection) => {
			console.log("setting user collection");
			return set({ userCollection });
		},
		appendToUserCollection: (gameId) =>
			set((state) => ({ userCollection: [...state.userCollection, gameId] })),
		removeFromUserCollection: (gameId) =>
			set((state) => ({
				userCollection: [...state.userCollection].filter((id) => id !== gameId),
			})),
		setUserFriends: (userFriends) => set({ userFriends }),
		appendFriend: (friendId) =>
			set((state) => ({ userFriends: [...state.userFriends, friendId] })),
		removeFriend: (friendId) =>
			set((state) => ({
				userFriends: [...state.userFriends].filter((id) => id !== friendId),
			})),
		setUserPlaylists: (userPlaylists) => {
			console.log("setting user playlists");
			return set({ userPlaylists });
		},
		appendToUserPlaylists: (playlistid) =>
			set((state) => ({ userPlaylists: [...state.userPlaylists, playlistid] })),
		removeFromUserPlaylists: (playlistid) =>
			set((state) => ({
				userPlaylists: [...state.userPlaylists].filter((id) => id !== playlistid),
			})),
	})),
);
