import { Card, CardHeader, CardSubTitle, CardContent } from "@/components";
import { usePlaylistViewData } from "../route";

export function FollowerSidebar() {
	const { aggregatedRating } = usePlaylistViewData();

	return (
		<Card>
			<CardHeader>
				<CardSubTitle>Playlist Stats</CardSubTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-5">
					<div className="flex justify-between">
						<p className="font-semibold">Followers:</p>
						<p>{aggregatedRating.count}</p>
					</div>
					<div className="flex justify-between">
						<p className="font-semibold">Rating:</p>
						<p>{Math.floor(Number(aggregatedRating.aggRating))}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
