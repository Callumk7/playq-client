import stylesheet from "@/tw.css";
import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
} from "@remix-run/react";
import { Providers } from "./components/providers";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;0,800;1,900&family=Syne:wght@700;800&display=swap",
	},
	{
		rel: "apple-touch-icon",
		sizes: "180x180",
		href: "/apple-touch-icon.png",
	},
	{
		rel: "icon",
		type: "image/png",
		sizes: "32x32",
		href: "/favicon-32x32.png",
	},
	{
		rel: "icon",
		type: "image/png",
		sizes: "16x16",
		href: "/favicon-16x16.png",
	},
	{
		rel: "manifest",
		href: "/site.webmanifest",
	},
];

export default function App() {
	return (
		<Providers>
			<html lang="en">
				<head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<Meta />
					<Links />
				</head>
				<body className="bg-background text-foreground font-sans">
					<Outlet />
					<ScrollRestoration />
					<Scripts />
					<LiveReload />
				</body>
			</html>
		</Providers>
	);
}

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
