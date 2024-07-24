import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Login,
} from "@/components";
import { User } from "@/types";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { NavLink, useNavigation } from "@remix-run/react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const links = [
	{
		to: "/",
		name: "Home",
	},
	{
		to: "/explore",
		name: "Explore",
	},
	{
		to: "/collection",
		name: "Collection",
	},
	{
		to: "/playlists",
		name: "Playlists",
	},
	{
		to: "/friends",
		name: "Friends",
	},
];

interface NavbarProps {
	supabase: SupabaseClient;
	session: Session | null;
  userDetails: User;
	sidebarOpen: boolean;
	setSidebarOpen: (sidebarOpen: boolean) => void;
}

export function Navbar({ supabase, session, sidebarOpen, setSidebarOpen, userDetails }: NavbarProps) {
	// auto-collapse on navigate. useNavigation is a remix hook,
	// and we create an effect that changes the controlled state of
	// the collapsible to closed once the navigation is 'idle', which
	// is to say it has completed navigation.
	const navigation = useNavigation();
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	useEffect(() => {
		if (navigation.state === "idle") {
			setIsMenuOpen(false);
		}
	}, [navigation.state]);

	// Use the same jsx for mobile and desktop navigation
	const linksMarkup = links.map((link) => <NavigationLink key={link.name} link={link} />);

	return (
		<nav className="flex fixed top-0 z-50 flex-row justify-between items-start py-4 px-6 w-full md:relative md:items-center bg-background/80 backdrop-blur">
			<div className="flex gap-6">
				<Button
					variant={"outline"}
					size={"icon"}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="hidden md:inline-flex"
				>
					{sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
				</Button>
				<Collapsible
					className="block md:hidden"
					open={isMenuOpen}
					onOpenChange={setIsMenuOpen}
				>
					<CollapsibleTrigger className="data-[state=open]:text-foreground/50 mt-2">
						<HamburgerMenuIcon className="w-6 h-6" />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="flex flex-col gap-3 mt-4">{linksMarkup}</div>
					</CollapsibleContent>
				</Collapsible>
				<div className="hidden flex-row gap-4 justify-start md:flex">{linksMarkup}</div>
			</div>
			<Login supabase={supabase} session={session} userDetails={userDetails} />
		</nav>
	);
}

export const NavigationLink = ({ link }: { link: { to: string; name: string } }) => (
	<NavLink key={link.name} to={link.to} prefetch="intent">
		{({ isActive, isPending }) => (
			<Button
				variant={isActive ? "navigation" : isPending ? "navigation" : "ghost"}
				size={"navigation"}
			>
				{link.name}
			</Button>
		)}
	</NavLink>
);
