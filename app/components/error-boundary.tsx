import { useRouteError, Meta, Links, Scripts } from "@remix-run/react";

export function ErrorBoundary() {
	const error = useRouteError();
	console.error(error);
	return (
		<html lang="en">
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="w-4.5 mx-auto mt-24 text-center">
					<h1 className="font-bold text-red-400 bg-background text-3xl">
						SOMETHING HAS GONE TERRIBLY WRONG
					</h1>
				</div>
				<Scripts />
			</body>
		</html>
	);
}
