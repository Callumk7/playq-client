import { z } from "zod";

export const gameCoverSchema = z.object({
	id: z.number(),
	cover: z.object({
		id: z.number(),
		image_id: z.string(),
	}),
	name: z.string(),
});

export const gameCoverArraySchema = z.array(gameCoverSchema);

export type GameCover = z.infer<typeof gameCoverSchema>;
export type GameCoverArray = z.infer<typeof gameCoverArraySchema>;
