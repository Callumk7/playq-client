import type { Config } from "drizzle-kit";

export default {
	schema: "./db/schema/*",
	driver: "pg",
	out: "./drizzle",
} satisfies Config;
