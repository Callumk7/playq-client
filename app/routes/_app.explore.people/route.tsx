import { authenticate } from "@/services";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getFriendSearchResults } from "./queries.server";
import { UserSearchTable } from "./components/user-search-table";
import { UserSearchForm } from "./components/user-search-form";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);

	const searchParams = new URL(request.url).searchParams;
	const query = searchParams.get("query");

	if (query) {
		const results = await getFriendSearchResults(query);
		return typedjson({ results, skipped: false });
	}

	return typedjson({ results: [], skipped: true });
};

export default function ExplorePeopleRoute() {
	const { results, skipped } = useTypedLoaderData<typeof loader>();

	return (
		<div className="mt-10 space-y-6">
      <UserSearchForm />
			{!skipped && <UserSearchTable users={results} />}
		</div>
	);
}
