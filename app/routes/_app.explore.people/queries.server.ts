import { db } from "db";
import { friends, users } from "db/schema/users";
import { eq, like, or } from "drizzle-orm";

export const getUserFriends = async (userId: string) => {
	const userFriends = await db.query.friends
		.findMany({
			where: eq(friends.userId, userId),
			with: {
				friend: true,
			},
		})
		.then((results) => results.map((result) => result.friend));

	return userFriends;
};

export const getFriendSearchResults = async (query: string | null) => {
	if (query) {
		return await db.query.users.findMany({
			where: or(
				like(users.username, `%${query}%`),
				like(users.email, `%${query}%`),
			),
			with: {
				friendsOf: {
					columns: {
						userId: true,
						friendId: true,
					},
				},
			},
		});
	}

	return [];
};
