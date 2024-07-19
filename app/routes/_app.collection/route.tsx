import { authenticate } from "@/services";
import { methodHandler } from "@/util/method-handling";
import { ActionFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { deleteRequestHandler, postRequestHandler } from "./method-handlers";

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		await authenticate(request);
	} catch (err) {
		return new Response(ReasonPhrases.UNAUTHORIZED, {
			status: StatusCodes.UNAUTHORIZED,
			statusText: ReasonPhrases.UNAUTHORIZED,
		});
	}

	return await methodHandler(request, [
		{
			method: "POST",
			function: postRequestHandler,
		},
		{
			method: "DELETE",
			function: deleteRequestHandler,
		},
	]);
};

export default function CollectionRoute() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
