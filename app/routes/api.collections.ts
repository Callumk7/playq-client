import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/users";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await zx.parseFormSafe(request, {
    gameId: zx.NumAsString,
    userId: z.string(),
  });

  if (formData.success) {
    // save a game to the user's collection
    const savedGame = await db
      .insert(usersToGames)
      .values({
        gameId: formData.data.gameId,
        userId: formData.data.userId,
      })
      .returning();

    return json({
      success: savedGame,
    });
  } else {
    return json({
      error: formData.error,
    });
  }
};
