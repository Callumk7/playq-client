import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "./session.server";
import invariant from "tiny-invariant";
import { db } from "db";
import { eq } from "drizzle-orm";
import { users } from "db/schema/users";

export interface Session {
	id: string;
	email: string;
}

export const authenticator = new Authenticator<Session>(sessionStorage);

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get("email");
		const password = form.get("password");

		invariant(typeof email === "string", "email must be a string");
		invariant(email.length > 0, "email must not be empty");

		invariant(typeof password === "string", "password must be a string");
		invariant(password.length > 0, "password must not be empty");

		const user = await login(email, password);
		return user;
	}),
	"user-pass",
);

const login = async (email: string, password: string) => {
	const foundUser = await db.query.users.findFirst({
		where: eq(users.email, email),
		columns: {
			id: true,
			email: true,
		},
	});

	invariant(foundUser, "no user found");
	return foundUser;
};
