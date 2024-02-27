import { Card, Container } from "@/components";
import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs } from "@remix-run/node";
import { UserWithActivityFeedEntry } from "@/types";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";
import { ReactNode } from "react";
import { getFriendActivity, transformActivity } from "@/model";
import {
	AddedGameToPlaylistActivity,
	AddedToCollectionActivity,
	GameCompletedActivity,
	GamePlayedActivity,
	GameRatedActivity,
	PlaylistCreatedActivity,
	PlaylistFollowedActivity,
	RemovedGameFromCollectionActivity,
	RemovedGameFromPlaylistActivity,
} from "@/components/activity/feed";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/login");
	}

	const activity = await getFriendActivity(session.user.id);
	const feed = transformActivity(activity);

	return typedjson({ session, feed }, { headers });
};

export default function AppIndex() {
	const { feed } = useTypedLoaderData<typeof loader>();
	return (
		<Container className="flex flex-col gap-10">
			{feed.map((a) => (
				<ActivityFeedCard activity={a} />
			))}
		</Container>
	);
}

interface ActivityFeedCardProps {
	activity: UserWithActivityFeedEntry;
}
function ActivityFeedCard({ activity }: ActivityFeedCardProps) {
	const type = activity.activity.type;

	let content: ReactNode = null;
	switch (type) {
		case "pl_create":
			content = (
				<PlaylistCreatedActivity user={activity} playlist={activity.activity.playlist} />
			);
			break;

		case "col_add":
			content = (
				<AddedToCollectionActivity user={activity} game={activity.activity.game} />
			);
			break;

		case "pl_add_game":
			content = (
				<AddedGameToPlaylistActivity
					user={activity}
					game={activity.activity.game}
					playlist={activity.activity.playlist}
				/>
			);
			break;

		case "pl_remove_game":
			content = (
				<RemovedGameFromPlaylistActivity
					user={activity}
					game={activity.activity.game}
					playlist={activity.activity.playlist}
				/>
			);
			break;

		case "pl_follow":
			content = (
				<PlaylistFollowedActivity user={activity} playlist={activity.activity.playlist} />
			);
			break;

		case "col_remove":
			content = (
				<RemovedGameFromCollectionActivity
					user={activity}
					game={activity.activity.game}
				/>
			);
			break;

		// TODO: this needs to be more granular
		case "comment_add":
			content = (
				<div>
					<p>{activity.username}</p>
					<p>Added a comment</p>
				</div>
			);
			break;

		case "game_played":
			content = <GamePlayedActivity user={activity} game={activity.activity.game} />;
			break;

		case "game_completed":
			content = <GameCompletedActivity user={activity} game={activity.activity.game} />;
			break;

		case "game_rated":
			content = (
				<GameRatedActivity
					user={activity}
					game={activity.activity.game}
					rating={activity.activity.rating}
				/>
			);
			break;

		default:
			return <div>something went wrong</div>;
	}

	const Feed: ReactNode = <Card className="p-3">{content}</Card>;
	return Feed;
}
