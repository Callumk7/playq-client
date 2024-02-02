CREATE TABLE IF NOT EXISTS "followers" (
	"user_id" text NOT NULL,
	"playlist_id" text NOT NULL,
	CONSTRAINT "followers_user_id_playlist_id_pk" PRIMARY KEY("user_id","playlist_id")
);
--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "is_private" boolean DEFAULT false NOT NULL;