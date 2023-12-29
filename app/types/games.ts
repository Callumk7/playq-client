import { games, covers, artworks, screenshots, genres, usersToGames } from "db/schema/games";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const gamesInsertSchema = createInsertSchema(games);
export const gamesSelectSchema = createSelectSchema(games);

export const insertUsersToGamesSchema = createInsertSchema(usersToGames);
export const selectUsersToGamesSchema = createSelectSchema(usersToGames);

export const coversInsertSchema = createInsertSchema(covers);
export const coversSelectSchema = createSelectSchema(covers);

export const artworksInsertSchema = createInsertSchema(artworks);
export const artworksSelectSchema = createSelectSchema(artworks);

export const screenshotsInsertSchema = createInsertSchema(screenshots);
export const screenshotsSelectSchema = createSelectSchema(screenshots);

export const genresInsertSchema = createInsertSchema(genres);
export const genresSelectSchema = createSelectSchema(genres);

export type Game = z.infer<typeof gamesSelectSchema>;
export type Cover = z.infer<typeof coversSelectSchema>;
export type Artwork = z.infer<typeof artworksSelectSchema>;
export type Screenshot = z.infer<typeof screenshotsSelectSchema>;
export type Genre = z.infer<typeof genresSelectSchema>;
export type UsersToGames = z.infer<typeof selectUsersToGamesSchema>;

export type InsertGame = z.infer<typeof gamesInsertSchema>;
export type InsertCover = z.infer<typeof coversInsertSchema>;
export type InsertArtwork = z.infer<typeof artworksInsertSchema>;
export type InsertScreenshot = z.infer<typeof screenshotsInsertSchema>;
export type InsertGenre = z.infer<typeof genresInsertSchema>;
export type InsertUsersToGames = z.infer<typeof insertUsersToGamesSchema>;

export type GameWithCover = Game & { cover: Cover };
