import { IGDB_BASE_URL } from "@/constants";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGameSchema } from "@/types/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	console.log("route hit")
	const url = new URL(request.url);
	const search = url.searchParams.get("search");

	if (search) {
		console.log(`searching for ${search}`)
		const results = await fetchGamesFromIGDB(IGDB_BASE_URL, {
			search: search,
			limit: 20,
			fields: "full",
			filters: ["cover != null"],
		});

		const games = results.map((game) => IGDBGameSchema.parse(game));
		console.log(games);
		return json(games);
	}

	return json([]);
};
