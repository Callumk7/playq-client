import { useState } from "react";

export const useHandleRateGameDialog = () => {
	const [isRateGameDialogOpen, setIsRateGameDialogOpen] = useState<boolean>(false);
	const [dialogGameId, setDialogGameId] = useState<number>(0);

	const handleOpenRateGameDialog = (gameId: number) => {
		setDialogGameId(gameId);
		setIsRateGameDialogOpen(true);
	};

	return {
		isRateGameDialogOpen,
		setIsRateGameDialogOpen,
		dialogGameId,
		handleOpenRateGameDialog,
	};
};
