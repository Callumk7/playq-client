import { authenticate } from "@/services";
import { methodHandler } from "@/util/method-handling";
import { ActionFunctionArgs } from "@remix-run/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { putRequestHandler } from "./method-handlers";

// api.collections.userId
// PUT updates
export const action = async ({ request, params }: ActionFunctionArgs) => {
	try {
		await authenticate(request);
	} catch (err) {
		return new Response(ReasonPhrases.UNAUTHORIZED, {
			status: StatusCodes.UNAUTHORIZED,
			statusText: ReasonPhrases.UNAUTHORIZED,
		});
	}

	const userId = String(params.userId);
	console.log(userId);

	return await methodHandler(
		request,
		[
			{
				method: "PUT",
				function: putRequestHandler,
			},
		],
		{ userId },
	);
};
