import { Link, Outlet } from "@remix-run/react";
export default function PlaylistsRoute() {
  return (
    <div>
      <PlaylistNav />
      <Outlet />
    </div>
  );
}

const playlistLinks = [
  {
    to: "/playlists/browse",
    name: "Browse",
  },
  {
    to: "/playlists/friends",
    name: "Friends",
  },
];

function PlaylistNav() {
  return (
    <nav className="flex gap-8">
      {playlistLinks.map((link) => (
        <Link
          key={link.name}
          to={link.to}
          className="text-foreground/60 hover:text-foreground transition-colors ease-in-out"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
