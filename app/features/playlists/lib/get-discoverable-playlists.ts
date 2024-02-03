import { db } from "db";
import { playlists } from "db/schema/playlists";
import { friends } from "db/schema/users";
import { and, eq, inArray, ne, or } from "drizzle-orm";

// Discoverable =
// 1. The user is the creator of the playlist
// 2. The user is friends with the creator of the playlist (and it is public)
export async function getDiscoverablePlaylists(userId: string) {
	// get user's friends id
	// TODO: make this its own function

	const userFriends = await db.query.friends
		.findMany({
			where: eq(friends.userId, userId),
		})
		.then((res) => res.map((friend) => friend.friendId));

	// inArray must have at least one entry
	const where =
		userFriends.length > 0
			? or(
					eq(playlists.creatorId, userId),
					inArray(playlists.creatorId, userFriends),
				)
			: eq(playlists.creatorId, userId);

	const discoverablePlaylists = await db.query.playlists.findMany({
		where: and(ne(playlists.isPrivate, true), where),
		columns: {
			id: true,
			name: true,
		},
		with: {
			creator: {
				columns: {
					id: true,
					username: true,
				},
			},
			games: {
				columns: {
					gameId: true,
				},
				limit: 4,
				with: {
					game: {
						columns: {
							id: true,
						},
						with: {
							cover: {
								columns: {
									imageId: true,
								},
							},
						},
					},
				},
			},
		},
	});

	return discoverablePlaylists;
}

export async function getPlaylistsWithCoversAndCreator(limit: number) {
  const playlists = await db.query.playlists.findMany({
    columns: {
      id: true,
      name: true,
    },
    with: {
      creator: {
        columns: {
          id: true,
          username: true,
        },
      },
      games: {
        columns: {
          gameId: true,
        },
        limit: 4,
        with: {
          game: {
            columns: {
              id: true,
            },
            with: {
              cover: {
                columns: {
                  imageId: true,
                },
              },
            },
          },
        },
      },
    },
    limit: limit,
  });

  return playlists;
}

