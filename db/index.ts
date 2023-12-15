import { singleton } from "@/util/singleton.server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as gamesSchema from "./schema/games";
import * as usersSchema from "./schema/users";

const pg = postgres(process.env.DATABASE_URL!);

export const db = singleton("drizzle", () =>
	drizzle(pg, {
		schema: { ...usersSchema, ...gamesSchema },
	}),
);

export type DB = typeof db;
