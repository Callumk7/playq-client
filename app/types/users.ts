import { users, usersToGames } from "db/schema/users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertUsersToGamesSchema = createInsertSchema(usersToGames);
export const selectUsersToGamesSchema = createSelectSchema(usersToGames);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export type InsertUsersToGames = z.infer<typeof insertUsersToGamesSchema>;
export type UsersToGames = z.infer<typeof selectUsersToGamesSchema>;

