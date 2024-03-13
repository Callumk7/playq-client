import { Outlet } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "@/services";
import { methodHandler } from "@/util/method-handling";
import { postRequestHandler } from "./method-handlers";

// Route handler for the CREATION OF PLAYLISTS
export const action = async ({ request }: ActionFunctionArgs) => {
	await authenticate(request);

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
