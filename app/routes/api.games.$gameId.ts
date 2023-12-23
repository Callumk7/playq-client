import { WORKER_URL } from "@/constants";
import { auth } from "@/features/auth/helper";
import { ActionFunctionArgs, json } from "@remix-run/node";

export const action = ({ params }: ActionFunctionArgs) => {

	const gameId = params.gameId;

	fetch(`${WORKER_URL}/games/${gameId}`, {
		method: "POST",
	}).then((res) => {
		if (res.ok) {
			console.log(`Successfully saved ${gameId} to our database.`);
		} else {
			console.error(`Failed to save ${gameId} to our database.`);
		}
	});

	return json("request received");
};
