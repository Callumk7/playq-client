import { db } from "db";
import { friends } from "db/schema/users";

export const connectAsFriends = async (userId: string, friendId: string) => {
	const outwardPromise = db
		.insert(friends)
		.values({
			userId,
			friendId,
		})
		.onConflictDoNothing();
	const inwardPromise = db
		.insert(friends)
		.values({
			userId: friendId,
			friendId: userId,
		})
		.onConflictDoNothing();
	try {
		await Promise.all([outwardPromise, inwardPromise]);
	} catch (error) {
		console.error("Unable to write friend connection: ", error)
		throw new Error("Unable to write friend connection")
	}
};
