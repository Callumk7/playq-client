CREATE TABLE IF NOT EXISTS "games_on_playlists" (
	"game_id" integer NOT NULL,
	"playlist_id" text NOT NULL,
	CONSTRAINT games_on_playlists_game_id_playlist_id PRIMARY KEY("game_id","playlist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creator_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_updated" boolean DEFAULT false
);
