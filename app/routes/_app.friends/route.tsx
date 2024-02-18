import { Container } from "@/components";
import { Outlet } from "@remix-run/react";

export default function FriendsRoute() {
	return (
		<Container className="flex flex-col gap-5">
			<Outlet />
		</Container>
	);
}
