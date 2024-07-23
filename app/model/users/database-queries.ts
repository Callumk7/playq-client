import { db } from "db";
import { users } from "db/schema/users";
import {eq} from "drizzle-orm";

export const getUserDetails = async (userId: string) => {
	const rows = await db.select().from(users).where(eq(users.id, userId));
	return rows[0];
}
