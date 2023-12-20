import { IGDB_BASE_URL } from "@/constants";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGameSchema } from "@/types/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export const action = async ({ request }: LoaderFunctionArgs) => {
	console.log("route hit")
	const jsonBody = await request.json();
	const search: string = jsonBody.search;

	if (search) {
		const results = await fetchGamesFromIGDB(IGDB_BASE_URL, {
			search: search,
			limit: 40,
			fields: "full",
			filters: ["cover != null"],
		});

		const games = results.map((game) => IGDBGameSchema.parse(game));
		console.log(games);
		return json({ games });
	}

	return json({ games: [] });
};
