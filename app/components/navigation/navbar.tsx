import { Button, Login } from "@/components";
import { NavLink } from "@remix-run/react";
import { Session, SupabaseClient } from "@supabase/supabase-js";

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
}

export function Navbar({ supabase, session }: NavbarProps) {
  return (
    <nav className="top-0 z-50 flex w-full flex-row items-center justify-between bg-background/80 px-6 py-4 backdrop-blur">
      <div className="flex flex-row justify-start gap-4">
        {links.map((link) => (
          <NavigationLink key={link.name} link={link} />
        ))}
      </div>
      <Login supabase={supabase} session={session} />
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
