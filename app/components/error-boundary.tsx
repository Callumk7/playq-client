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
				<div className="mx-auto mt-24 text-center w-4.5">
					<h1 className="text-3xl font-bold text-red-400 bg-background">
						SOMETHING HAS GONE TERRIBLY WRONG
					</h1>
				</div>
				<Scripts />
			</body>
		</html>
	);
}
