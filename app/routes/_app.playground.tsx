import { useFetcher } from "@remix-run/react";

export default function Playground() {
	const fetcher = useFetcher();
	return (
		<button
			type="button"
			onClick={() => fetcher.submit({}, { method: "PATCH", action: "/playlists" })}
		>
			send a test patch
		</button>
	);
}
