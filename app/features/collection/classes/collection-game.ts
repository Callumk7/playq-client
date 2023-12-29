import { Artwork, Cover, Game, Genre, Screenshot } from "@/types/games";
import { Playlist } from "@/types/playlists";
import { UsersToGames } from "@/types/users";

// NOTE: This was an experiment, but I don't think using a class 
// is a great idea, compared to creating a schema with zod and validating
// against that. 

export class CollectionGameClass {
	public id: string;
	public gameId: number;
	public title: string;
	public createdAt: Date;
	public updatedAt: Date;
	public follows: number;
	public storyline: string | null;
	public firstReleaseDate: Date | null;
	public externalFollows: number | null;
	public rating: number | null;
	public aggregatedRating: number | null;
	public aggregatedRatingCount: number | null;
	public genres: Genre[];
	public artworks: Artwork[];
	public screenshots: Screenshot[];
	public playlists: Playlist[];
	public cover: Cover;
	public played: boolean;
	public completed: boolean;
	public playerRating: number | null;
	public position: number | null;

	constructor(
		game: Game,
		userGame: UsersToGames,
		genres: Genre[],
		cover: Cover,
		artworks: Artwork[] = [],
		screenshots: Screenshot[] = [],
		playlists: Playlist[] = [],
	) {
		this.id = game.id;
		this.gameId = game.gameId;
		this.title = game.title;
		this.createdAt = game.createdAt;
		this.updatedAt = game.updatedAt;
		this.follows = game.follows;
		this.storyline = game.storyline;
		this.firstReleaseDate = game.firstReleaseDate;
		this.externalFollows = game.externalFollows;
		this.rating = game.rating;
		this.aggregatedRating = game.aggregatedRating;
		this.aggregatedRatingCount = game.aggregatedRatingCount;
		this.genres = genres;
		this.artworks = artworks;
		this.screenshots = screenshots;
		this.playlists = playlists;
		this.cover = cover;
		this.played = userGame.played;
		this.completed = userGame.completed;
		this.playerRating = userGame.playerRating;
		this.position = userGame.position;
	}
}
