import { FULL_GAME_FIELDS, IGDB_BASE_URL } from "@/constants";
import {
	IGDBGame,
	IGDBGameSchema,
	InsertArtwork,
	InsertCover,
	InsertGame,
	InsertGenre,
	InsertGenreToGames,
	InsertScreenshot,
} from "@/types";
import { uuidv4 } from "callum-util";
import { DB } from "db";
import {
	artworks,
	covers,
	games,
	genres,
	genresToGames,
	screenshots,
} from "db/schema/games";

export interface FetchOptions {
	fields?: string[] | "full";
	limit?: number;
	offset?: number;
	filters?: string[];
	sort?: string[];
	search?: string;
}

// TODO: Migrate to the better sdk below
export const fetchGamesFromIGDB = async (
	baseUrl: string,
	options: FetchOptions,
	headersOverride?: Record<string, string>,
): Promise<unknown[]> => {
	let body = "";

	if (options.search) {
		body += `search "${options.search}";`;
	}

	if (options.fields) {
		if (options.fields === "full") {
			body += FULL_GAME_FIELDS;
		} else {
			body += `fields ${options.fields.join(", ")};`;
		}
	}

	if (options.limit) {
		body += `limit ${options.limit};`;
	}

	if (options.offset) {
		body += `offset ${options.offset};`;
	}

	if (options.filters) {
		body += `where ${options.filters.join("& ")};`;
	}

	if (options.sort) {
		body += `sort ${options.sort.join(", ")};`;
	}

	// TODO: Add pagination

	let headers: Record<string, string> = {
		"Client-ID": process.env.IGDB_CLIENT_ID!,
		Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
		"content-type": "text/plain",
	};

	if (headersOverride) {
		headers = headersOverride;
	}

	try {
		const res = await fetch(`${baseUrl}/games`, { method: "POST", headers, body });
		const json = await res.json();
		return json as unknown[];
	} catch (e) {
		console.error(e);
		throw new Error("Error fetching games from IGDB");
	}
};

export const fetchGenresFromIGDB = async () => {
	const url = "https://api.igdb.com/v4/genres";
	const body = "fields name; limit 50;";

	const headers: Record<string, string> = {
		"Client-ID": process.env.IGDB_CLIENT_ID!,
		Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
		"content-type": "text/plain",
	};

	try {
		const res = await fetch(url, { method: "POST", headers, body });
		const json = await res.json();
		return json as { id: string; name: string }[];
	} catch (e) {
		console.error(e);
		throw new Error("Error fetching games from IGDB");
	}
};

////////////////////////////////////////////////////////////////////////////////
//                           IGDB TYPESCRIPT SDK
////////////////////////////////////////////////////////////////////////////////

export class IGDBClient {
	private baseUrl: string = IGDB_BASE_URL;
	private clientId: string;
	private accessToken: string;

	constructor(clientId: string, accessToken: string) {
		this.clientId = clientId;
		this.accessToken = accessToken;
	}

	games(preset: "full" | "default" = "default"): QueryBuilder {
		return new QueryBuilder().selectPreset(preset);
	}

	async execute(endpoint: string, queryBuilder: QueryBuilder): Promise<unknown[]> {
		const query = queryBuilder.build();
		const response = await fetch(`${this.baseUrl}/${endpoint}`, {
			method: "POST",
			headers: {
				"Client-ID": this.clientId,
				Authorization: `Bearer ${this.accessToken}`,
				Accept: "application/json",
				"Content-Type": "text/plain",
			},
			body: query,
		});

		if (!response.ok) {
			console.error(response.statusText);
			console.error(await response.text());
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	}
}

class QueryBuilder {
	private fields: string[] = [];
	private whereConditions: string[] = [];
	private searchTerm: string | null = null;
	private sortOptions: string[] = [];
	private limitValue: number | null = null;
	private offsetValue: number | null = null;

	private readonly presetSelections = {
		full: [
			"name",
			"artworks.image_id",
			"screenshots.image_id",
			"aggregated_rating",
			"aggregated_rating_count",
			"cover.image_id",
			"storyline",
			"first_release_date",
			"genres.name",
			"follows",
			"involved_companies",
			"rating",
		],
		default: ["name", "cover.image_id", "rating"],
	};

	selectPreset(preset: "full" | "default" = "default"): QueryBuilder {
		this.fields = [...this.presetSelections[preset]];
		return this;
	}

	select(...fields: string[]): QueryBuilder {
		this.fields.push(...fields);
		return this;
	}

	where(condition: string): QueryBuilder {
		this.whereConditions.push(condition);
		return this;
	}

	search(searchTerm: string | null): QueryBuilder {
		this.searchTerm = searchTerm;
		return this;
	}

	sort(field: string, order: "asc" | "desc" = "asc"): QueryBuilder {
		this.sortOptions.push(`${field} ${order}`);
		return this;
	}

	limit(value: number | null): QueryBuilder {
		this.limitValue = value;
		return this;
	}

	offset(value: number | null): QueryBuilder {
		this.offsetValue = value;
		return this;
	}

	build(): string {
		let query = "";
		if (this.searchTerm) {
			query += ` search "${this.searchTerm}";`;
		}
		if (this.fields.length > 0) {
			query += `fields ${this.fields.join(", ")};`;
		}
		if (this.whereConditions.length > 0) {
			query += ` where ${this.whereConditions.join(" & ")};`;
		}
		if (this.sortOptions.length > 0 && this.searchTerm === null) {
			query += ` sort ${this.sortOptions.join(", ")};`;
		}
		if (this.limitValue !== null) {
			query += ` limit ${this.limitValue};`;
		}
		if (this.offsetValue !== null) {
			query += ` offset ${this.offsetValue};`;
		}
		console.log(query);
		return query;
	}
}

////////////////////////////////////////////////////////////////////////////////
//							SAVE GAME SERVICE
////////////////////////////////////////////////////////////////////////////////

export class SaveGameService {
	private client: IGDBClient;
	private db: DB;

	constructor(db: DB, client: IGDBClient) {
		this.db = db;
		this.client = client;
	}

	async getGameFromIGDB(gameId: number) {
		const gameData = await this.client.execute(
			"games",
			this.client.games("full").where(`id = ${gameId}`),
		);

		console.log(gameData);
		let validGame: IGDBGame;
		try {
			validGame = IGDBGameSchema.parse(gameData[0]);
		} catch (error) {
			console.error(
				"SaveGameService.getGameFromIGDB has hit an error parsing the returned value from IGDB: ",
				error,
			);
			throw new Error("SaveGameService.getGameFromIGDB has thrown an error");
		}

		const [
			gameInsert,
			coverInsert,
			artworkInsert,
			screenshotInsert,
			genreInsert,
			genreToGameInsert,
		] = createDbInserts(validGame);

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const promises: Promise<any>[] = [];
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let gameInsertPromise: Promise<any>;
		if (gameInsert) {
			gameInsertPromise = this.db
				.insert(games)
				.values(gameInsert)
				.onConflictDoNothing({ target: games.gameId })
				.returning();
			promises.push(gameInsertPromise);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let coverInsertPromise: Promise<any>;
		if (coverInsert.length > 0) {
			coverInsertPromise = this.db
				.insert(covers)
				.values(coverInsert)
				.onConflictDoNothing({ target: covers.imageId })
				.returning();
			promises.push(coverInsertPromise);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let artworkInsertPromise: Promise<any>;
		if (artworkInsert.length > 0) {
			artworkInsertPromise = this.db
				.insert(artworks)
				.values(artworkInsert)
				.onConflictDoNothing({ target: artworks.imageId })
				.returning();
			promises.push(artworkInsertPromise);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let screenshotInsertPromise: Promise<any>;
		if (screenshotInsert.length > 0) {
			screenshotInsertPromise = this.db
				.insert(screenshots)
				.values(screenshotInsert)
				.onConflictDoNothing({ target: screenshots.imageId })
				.returning();
			promises.push(screenshotInsertPromise);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let genreInsertPromise: Promise<any>;
		if (genreInsert.length > 0) {
			genreInsertPromise = this.db
				.insert(genres)
				.values(genreInsert)
				.onConflictDoNothing({ target: genres.id })
				.returning();
			promises.push(genreInsertPromise);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let genreToGameInsertPromise: Promise<any>;
		if (genreToGameInsert.length > 0) {
			genreToGameInsertPromise = this.db
				.insert(genresToGames)
				.values(genreToGameInsert)
				.onConflictDoNothing()
				.returning();
			promises.push(genreToGameInsertPromise);
		}

		const results = await Promise.all(promises);
		console.log(results);
	}

	async saveGamesToDatabase(gameData: unknown[]) {
		const validGames: IGDBGame[] = [];
		const invalidGames: unknown[] = [];
		for (const game of gameData) {
			try {
				validGames.push(IGDBGameSchema.parse(game));
			} catch (e) {
				invalidGames.push(game);
				console.error(e);
			}
		}

		const coverInserts: InsertCover[] = [];
		const artworkInserts: InsertArtwork[] = [];
		const screenshotInserts: InsertScreenshot[] = [];
		const genreInserts: InsertGenre[] = [];
		const genreToGameInserts: InsertGenreToGames[] = [];
		const gameInserts: InsertGame[] = [];
		validGames.map((game) => {
			const [
				gameInsert,
				coverInsert,
				artworkInsert,
				screenshotInsert,
				genreInsert,
				genreToGameInsert,
			] = createDbInserts(game);

			coverInserts.push(...coverInsert);
			artworkInserts.push(...artworkInsert);
			screenshotInserts.push(...screenshotInsert);
			gameInserts.push(gameInsert);
			genreInserts.push(...genreInsert);
			genreToGameInserts.push(...genreToGameInsert);
		});

		console.log(genreToGameInserts);
		const insertedGamesPromise = this.db
			.insert(games)
			.values(gameInserts)
			.onConflictDoNothing({ target: games.gameId })
			.returning();

		const insertedCoversPromise = this.db
			.insert(covers)
			.values(coverInserts)
			.onConflictDoNothing({ target: covers.imageId })
			.returning();

		const insertedArtworksPromise = this.db
			.insert(artworks)
			.values(artworkInserts)
			.onConflictDoNothing({ target: artworks.imageId })
			.returning();

		const insertedScreenshotsPromise = this.db
			.insert(screenshots)
			.values(screenshotInserts)
			.onConflictDoNothing({ target: screenshots.imageId })
			.returning();

		const insertedGenresPromise = this.db
			.insert(genres)
			.values(genreInserts)
			.onConflictDoNothing({ target: genres.id })
			.returning();

		const insertedGenreToGamePromise = this.db
			.insert(genresToGames)
			.values(genreToGameInserts)
			.onConflictDoNothing()
			.returning();

		// Wait for all the promises to resolve.
		// TODO: Handle errors.
		const [
			insertedGames,
			insertedCovers,
			insertedArtworks,
			insertedScreenshots,
			insertedGenres,
			insertedGenreToGames,
		] = await Promise.all([
			insertedGamesPromise,
			insertedCoversPromise,
			insertedArtworksPromise,
			insertedScreenshotsPromise,
			insertedGenresPromise,
			insertedGenreToGamePromise,
		]);
	}
}

export const createDbInserts = (
	validGame: IGDBGame,
): [
	InsertGame,
	InsertCover[],
	InsertArtwork[],
	InsertScreenshot[],
	InsertGenre[],
	InsertGenreToGames[],
] => {
	const coverInsert: InsertCover[] = [];
	const artworkInsert: InsertArtwork[] = [];
	const screenshotInsert: InsertScreenshot[] = [];
	const genreInsert: InsertGenre[] = [];
	const genreToGameInsert: InsertGenreToGames[] = [];
	const gameInsert: InsertGame = {
		id: `game_${uuidv4()}`,
		title: validGame.name,
		gameId: validGame.id,
	};

	if (validGame.storyline) {
		gameInsert.storyline = validGame.storyline;
	}

	if (validGame.follows) {
		gameInsert.externalFollows = validGame.follows;
	}

	if (validGame.aggregated_rating) {
		gameInsert.aggregatedRating = Math.floor(validGame.aggregated_rating);
	}

	if (validGame.aggregated_rating_count) {
		gameInsert.aggregatedRatingCount = validGame.aggregated_rating_count;
	}

	if (validGame.rating) {
		gameInsert.rating = Math.floor(validGame.rating);
	}

	if (validGame.first_release_date) {
		gameInsert.firstReleaseDate = new Date(validGame.first_release_date * 1000);
	}

	if (validGame.cover) {
		coverInsert.push({
			id: `cover_${uuidv4()}`,
			gameId: validGame.id,
			imageId: validGame.cover.image_id,
		});
	}

	if (validGame.artworks) {
		validGame.artworks.forEach((artwork) => {
			artworkInsert.push({
				id: `artwork_${uuidv4()}`,
				gameId: validGame.id,
				imageId: artwork.image_id,
			});
		});
	}

	if (validGame.screenshots) {
		validGame.screenshots.forEach((screenshot) => {
			screenshotInsert.push({
				id: `screenshot_${uuidv4()}`,
				gameId: validGame.id,
				imageId: screenshot.image_id,
			});
		});
	}

	if (validGame.genres) {
		validGame.genres.forEach((genre) => {
			genreInsert.push({
				id: genre.id,
				name: genre.name,
			});

			genreToGameInsert.push({
				gameId: validGame.id,
				genreId: genre.id,
			});
		});
	}

	return [
		gameInsert,
		coverInsert,
		artworkInsert,
		screenshotInsert,
		genreInsert,
		genreToGameInsert,
	];
};
