import { authenticate } from "@/services";
import { ActionFunctionArgs, data } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { db } from "db";
import { friends } from "db/schema/users";
import { and, eq } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { zx } from "zodix";
import { connectAsFriends } from "./queries.server";

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

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await authenticate(request);
	const { userId, friendId } = await parseRequest(request);

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

export default function FriendsRoute() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
