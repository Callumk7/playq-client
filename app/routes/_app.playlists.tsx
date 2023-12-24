import { Container } from "@/features/layout/container";
import { Separator } from "@radix-ui/react-separator";
import { Outlet } from "@remix-run/react";

export default function PlaylistsRoute() {
  return (
    <Container>
      <h1>Playlists</h1>
      <Separator />
      <Outlet />
    </Container>
  )
}
