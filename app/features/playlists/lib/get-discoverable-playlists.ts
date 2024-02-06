import { isFalse } from "@/util/drizzle/is-false";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { and, ne } from "drizzle-orm";

export async function getDiscoverablePlaylists(userId: string) {
	const discoverablePlaylists = await db.query.playlists.findMany({
		where: and(isFalse(playlists.isPrivate), ne(playlists.creatorId, userId)),
		with: {
			creator: true,
			games: {
				with: {
					game: {
						with: {
							cover: true
						}
					}
				}
			}
		}
	});

	return discoverablePlaylists;
}
