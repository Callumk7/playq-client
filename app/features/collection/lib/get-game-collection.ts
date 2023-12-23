import { UsersToGames } from "@/types/users"
import { db } from "db"
import { usersToGames } from "db/schema/users"
import { eq } from "drizzle-orm"

export const getUserGameCollection = async (userId: string) => {
	const userCollection = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, userId),
		with: {
			game: {
				with: {
					cover: true,
				}
			}
		}
	})

	return userCollection;
}
