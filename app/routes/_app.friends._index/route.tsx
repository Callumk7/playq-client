import { Card, Container } from "@/components";
import { Button } from "@/components/ui/button";
import { createServerClient, getSession } from "@/services";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { friends } from "db/schema/users";
import { eq } from "drizzle-orm";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const userFriends = await db.query.friends.findMany({
		where: eq(friends.userId, session.user.id),
		with: {
			friend: true,
		},
	});

	return json({ userFriends }, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabase } = createServerClient(request);
	const session = await getSession(supabase);

	const formData = await request.formData();
	const friendId = String(formData.get("friend_id"));

	const newFriend = await db.insert(friends).values({
		userId: session!.user.id,
		friendId: friendId,
	});

	const newConnection = await db.insert(friends).values({
		userId: friendId,
		friendId: session!.user.id,
	});

	return { newFriend, newConnection };
};

export default function FriendsRoute() {
	const { userFriends } = useLoaderData<typeof loader>();
	return (
		<Container className="flex flex-col gap-5">
			<h1>Hello this is the friends route</h1>
			{userFriends.map((f) => (
				<Card key={f.friendId}>
					<div className="flex justify-between">
						<Link to={`/friends/${f.friendId}`}>{f.friend.username}</Link>
						<Card>
							<Button>Delete</Button>
						</Card>
					</div>
				</Card>
			))}
		</Container>
	);
}
