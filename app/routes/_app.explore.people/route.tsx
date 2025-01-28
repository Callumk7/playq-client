import { authenticate } from "@/services";
import { ActionFunctionArgs, LoaderFunctionArgs, data } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import {
	connectAsFriends,
	getFriendSearchResults,
	getUserFriendIds,
} from "./queries.server";
import { UserSearchTable } from "./components/user-search-table";
import { UserSearchForm } from "./components/user-search-form";
import { and, eq } from "drizzle-orm";
import { friends } from "db/schema/users";
import { db } from "db";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { zx } from "zodix";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);

	const searchParams = new URL(request.url).searchParams;
	const query = searchParams.get("query");

	const userFriendIds = await getUserFriendIds(session.user.id);

	if (query) {
		const results = await getFriendSearchResults(query);
		return typedjson({ results, userFriendIds, skipped: false });
	}

	return typedjson({ results: [], userFriendIds, skipped: true });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await authenticate(request);
	const { userId, friendId } = await parseRequest(request);

	if (userId !== session.user.id) {
		return data(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
	}

	if (request.method === "POST") {
		try {
			await connectAsFriends(userId, friendId);
			return data({ success: true, userId, friendId });
		} catch (error) {
			console.error("There was an error connecting friends");
			return data({ success: false });
		}
	}

	if (request.method === "DELETE") {
		const removeFriend = await db
			.delete(friends)
			.where(and(eq(friends.userId, session!.user.id), eq(friends.friendId, friendId)));

		const removeConnection = await db
			.delete(friends)
			.where(and(eq(friends.userId, friendId), eq(friends.friendId, session!.user.id)));
		return { removeFriend, removeConnection };
	}
	return new Response("Method not allowed", { status: 405 });
};

export default function ExplorePeopleRoute() {
	const { results, userFriendIds, skipped } = useTypedLoaderData<typeof loader>();

	return (
		<div className="mt-10 space-y-6">
			<UserSearchForm />
			{!skipped && <UserSearchTable users={results} friendIds={userFriendIds} />}
		</div>
	);
}

const parseRequest = async (request: Request) => {
	const result = await zx.parseFormSafe(request, {
		userId: z.string(),
		friendId: z.string(),
	});

	if (!result.success) {
		throw new Response(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
	}

	return {
		userId: result.data.userId,
		friendId: result.data.friendId,
	};
};
