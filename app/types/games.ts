import {
	games,
	covers,
	artworks,
	screenshots,
	genres,
	usersToGames,
	genresToGames,
} from "db/schema/games";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { GamesOnPlaylistWithPlaylist, playlistsSelectSchema } from "./playlists";

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

export const genresToGamesInsertSchema = createInsertSchema(genresToGames);
export const genresToGamesSelectSchema = createSelectSchema(genresToGames);

export type Game = z.infer<typeof gamesSelectSchema>;
export type Cover = z.infer<typeof coversSelectSchema>;
export type Artwork = z.infer<typeof artworksSelectSchema>;
export type Screenshot = z.infer<typeof screenshotsSelectSchema>;
export type Genre = z.infer<typeof genresSelectSchema>;
export type GenreToGames = z.infer<typeof genresToGamesSelectSchema>;
export type UsersToGames = z.infer<typeof selectUsersToGamesSchema>;

export type InsertGame = z.infer<typeof gamesInsertSchema>;
export type InsertCover = z.infer<typeof coversInsertSchema>;
export type InsertArtwork = z.infer<typeof artworksInsertSchema>;
export type InsertScreenshot = z.infer<typeof screenshotsInsertSchema>;
export type InsertGenre = z.infer<typeof genresInsertSchema>;
export type InsertGenreToGames = z.infer<typeof genresToGamesInsertSchema>;
export type InsertUsersToGames = z.infer<typeof insertUsersToGamesSchema>;

export type GameWithCover = Game & { cover: Cover };
export type CollectionWithGame = UsersToGames & { game: GameWithCover };

///
/// Shape the data for the client
///
export const gameWithCollectionSchema = gamesSelectSchema.extend({
	cover: coversSelectSchema,
	genres: z.array(genresSelectSchema),
	screenshots: z.array(screenshotsSelectSchema),
	artworks: z.array(artworksSelectSchema),
	playlists: z.array(playlistsSelectSchema),
	played: z.boolean(),
	playerRating: z.number().nullable(),
	completed: z.boolean().nullable(),
	position: z.number().nullable(),
	dateAdded: z.date(),
	pinned: z.boolean(),
});

export type GameWithCollection = z.infer<typeof gameWithCollectionSchema>;

export type GenreToGamesWithGenre = GenreToGames & {
	genre: Genre;
};

export type GameWithFullDetails = Game & {
	cover: Cover;
	playlists: GamesOnPlaylistWithPlaylist[];
	screenshots: Screenshot[];
	artworks: Artwork[];
	genres: GenreToGamesWithGenre[];
};

export type UserCollectionWithFullDetails = UsersToGames & {
	game: GameWithFullDetails;
};

// Define the base game schema
const gameSchema = gamesSelectSchema.extend({
  cover: coversSelectSchema,
  genres: z.array(genresSelectSchema),
  screenshots: z.array(screenshotsSelectSchema),
  artworks: z.array(artworksSelectSchema),
  playlists: z.array(playlistsSelectSchema),
});

// Define the collection data schema
const collectionDataSchema = z.object({
  played: z.boolean(),
  playerRating: z.number().nullable(),
  completed: z.boolean().nullable(),
  position: z.number().nullable(),
  dateAdded: z.date(),
  pinned: z.boolean(),
});

// Create the full game schema
const fullGameSchema = gameSchema.extend({
  inCollection: z.boolean(),
  collectionData: collectionDataSchema.nullable(),
}).refine(
  (data) => {
    if (data.inCollection) {
      return data.collectionData !== null;
    }
      return data.collectionData === null;
  },
  {
    message: "Collection data must be present when inCollection is true, and null when false",
    path: ["collectionData"],
  }
);

export type GameAndOptionalCollectionData = z.infer<typeof fullGameSchema>;

