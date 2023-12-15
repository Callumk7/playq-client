export async function getSearchResults(q: string): Promise<IGDBGame[]> {
	const res = await fetch(process.env.IGDB_URL!, {
		method: "POST",
		headers: {
			"Client-ID": process.env.IGDB_CLIENT_ID!,
			Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
			"content-type": "text/plain",
		},
		body: `search "${q}"; fields name, artworks.image_id, screenshots.image_id, aggregated_rating, aggregated_rating_count, cover.image_id, storyline, first_release_date, genres.name; limit 40; where artworks != null & cover.image_id != null;`,
	});

	if (!res.ok) {
		throw new Error("igdb fetch failed");
	}

	console.log("IGDB fetch completed");

	// this is unknown, as we do not know shape of return
	const data = await res.json();
	console.log(`${data.length} results found`);

	// validate results
	const results: IGDBGame[] = [];
	for (const result of data) {
		const validResult = IGDBGameSchema.parse(result);
		results.push(validResult);
	}
	console.log(`${results.length} valid results`);
	return results;
}
