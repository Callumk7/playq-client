import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CollectionStore {
	userCollection: number[];
	setUserCollection: (userCollection: number[]) => void;
	appendToUserCollection: (gameId: number) => void;
	removeFromUserCollection: (gameId: number) => void;
}

export const useCollectionStore = create<CollectionStore>()(
	devtools((set) => ({
		userCollection: [],
		setUserCollection: (userCollection) => set({ userCollection }),
		appendToUserCollection: (gameId) =>
			set((state) => ({ userCollection: [...state.userCollection, gameId] })),
		removeFromUserCollection: (gameId) =>
			set((state) => ({
				userCollection: [...state.userCollection].filter((id) => id !== gameId),
			})),
	})),
);
