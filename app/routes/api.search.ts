import { IGDB_BASE_URL, WORKER_URL } from "@/constants";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGameSchema } from "@/types/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	console.log("route hit");
	const url = new URL(request.url);
	const search = url.searchParams.get("search");

	if (search) {
		console.log(`searching for ${search}`);
		const results = await fetchGamesFromIGDB(IGDB_BASE_URL, {
			search: search,
			limit: 20,
			fields: "full",
			filters: ["cover != null"],
		});

		const games = results.map((game) => IGDBGameSchema.parse(game));
		
		return json(games);
	}

	return json([]);
};

const saveGameToDatabase = (gameId: number) => {
	fetch(`${WORKER_URL}/games/${gameId}`, {
		method: "POST",
	}).then((res) => {
		if (res.ok) {
			console.log(`Successfully saved ${gameId} to our database.`);
		} else {
			console.error(`Failed to save ${gameId} to our database.`);
		}
	});
};
