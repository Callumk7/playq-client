ALTER TABLE "artworks" ADD CONSTRAINT "artworks_image_id_unique" UNIQUE("image_id");--> statement-breakpoint
ALTER TABLE "covers" ADD CONSTRAINT "covers_image_id_unique" UNIQUE("image_id");--> statement-breakpoint
ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_image_id_unique" UNIQUE("image_id");