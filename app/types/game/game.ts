import { z } from "zod";

export const gameCover = z.object({
	id: z.number(),
	cover: z.object({
		id: z.number(),
		image_id: z.string(),
	}),
	name: z.string(),
});

export const gameCoverArray = z.array(gameCover);

export type GameCover = z.infer<typeof gameCover>;
export type GameCoverArray = z.infer<typeof gameCoverArray>;
