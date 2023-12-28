import { games, covers, artworks, screenshots } from "db/schema/games";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { GamesOnPlaylist, Playlist } from "./playlists";

export const gamesInsertSchema = createInsertSchema(games);
export const gamesSelectSchema = createSelectSchema(games);

export const coversInsertSchema = createInsertSchema(covers);
export const coversSelectSchema = createSelectSchema(covers);

export const artworksInsertSchema = createInsertSchema(artworks);
export const artworksSelectSchema = createSelectSchema(artworks);

export const screenshotsInsertSchema = createInsertSchema(screenshots);
export const screenshotsSelectSchema = createSelectSchema(screenshots);

export type Game = z.infer<typeof gamesSelectSchema>;
export type Cover = z.infer<typeof coversSelectSchema>;
export type Artwork = z.infer<typeof artworksSelectSchema>;
export type Screenshot = z.infer<typeof screenshotsSelectSchema>;

export type InsertGame = z.infer<typeof gamesInsertSchema>;
export type InsertCover = z.infer<typeof coversInsertSchema>;
export type InsertArtwork = z.infer<typeof artworksInsertSchema>;
export type InsertScreenshot = z.infer<typeof screenshotsInsertSchema>;

export type GameWithCover = Game & { cover: Cover };
export type GameWithPlaylists = GameWithCover & { playlists }
