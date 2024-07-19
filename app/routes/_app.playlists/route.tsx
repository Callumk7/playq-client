import { Outlet } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { authenticate } from "@/services";
import { methodHandler } from "@/util/method-handling";
import { postRequestHandler } from "./method-handlers";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// Route handler for the CREATION OF PLAYLISTS
export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		await authenticate(request);
	} catch (err) {
		return json(ReasonPhrases.UNAUTHORIZED, {
			status: StatusCodes.UNAUTHORIZED,
			statusText: ReasonPhrases.UNAUTHORIZED,
		});
	}

	return await methodHandler(request, [
		{
			method: "POST",
			function: postRequestHandler,
		},
	]);
};

export default function PlaylistsRoute() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
