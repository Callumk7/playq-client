import { db } from "db";
import { users } from "./schema/users";
import { uuidv4 } from "@/util/generate-uuid";

const seedUsers = [
	{
		id: `user_${uuidv4()}`,
		username: "Thumber",
		firstName: "Tom",
		lastName: "Thumb",
		email: "tom@email.com",
		password: "passW00rd",
	},
	{
		id: `user_${uuidv4()}`,
		username: "Alice Wonder",
		email: "alice@email.com",
		password: "passW00rd",
	},
	{
		id: `user_${uuidv4()}`,
		username: "Callum Kloos",
		email: "callum@email.com",
		password: "passW00rd",
	},
	{
		id: `user_${uuidv4()}`,
		username: "Martin O",
		email: "martin@email.com",
		password: "passW00rd",
	},
	{
		id: `user_${uuidv4()}`,
		username: "Emile Smith",
		email: "emile@email.com",
		password: "passW00rd",
	},
];

const seededUsers = await db.insert(users).values(seedUsers);
console.log(seededUsers);
