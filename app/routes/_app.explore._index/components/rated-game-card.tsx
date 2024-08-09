import { GameCover, SaveToCollectionButton } from "@/components";
import { useAppData } from "@/routes/_app/route";
import { GameWithCover } from "@/types";
import { RatingCard } from "./rating-card";

interface RatedGameCardProps {
	game: GameWithCover;
	avRating: number;
	ratingCount: number;
  userId: string;
}

export function RatedGameCard({ game, avRating, ratingCount, userId }: RatedGameCardProps) {
	const { userCollectionIds } = useAppData();
	return (
		<div className="relative flex flex-col gap-3">
			{!userCollectionIds.includes(game.gameId) && (
				<div className="absolute top-3 right-3 z-20">
					<SaveToCollectionButton
						variant="outline"
						gameId={game.gameId}
						userId={userId}
					/>
				</div>
			)}
			<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
			<RatingCard avRating={avRating} ratingCount={ratingCount} />
		</div>
	);
}
