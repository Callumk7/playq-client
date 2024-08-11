import type { Config } from "drizzle-kit";

export default {
	schema: "./db/schema/*",
	dialect: "postgresql",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.C_DATABASE_URL!
	}
} satisfies Config;
