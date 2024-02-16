import { useFetcher } from "@remix-run/react";

export const useCollectionControls = (userId: string, gameId: number) => {
	const deleteFetcher = useFetcher();
	const playedFetcher = useFetcher();
	const completedFetcher = useFetcher();

	const handleRemove = () => {
		deleteFetcher.submit(
			{
				gameId,
				userId,
			},
			{
				method: "delete",
				action: "/api/collections",
			},
		);
	};

	const handleMarkAsPlayed = () => {
		playedFetcher.submit(
			{
				gameId,
				played: true,
			},
			{
				method: "put",
				action: `/api/collections/${userId}`,
			},
		);
	};

	const handleMarkAsCompleted = () => {
		completedFetcher.submit(
			{
				gameId,
				completed: true,
			},
			{
				method: "put",
				action: `/api/collections/${userId}`,
			},
		);
	};

	return {
		handleRemove,
		handleMarkAsPlayed,
		handleMarkAsCompleted,
	};
};
