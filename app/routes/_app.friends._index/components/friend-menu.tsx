import { Button } from "@/components";
import { Link } from "@remix-run/react";

export function FriendMenu() {
	return (
		<div>
			<Button asChild variant={"outline"} size={"sm"}>
				<Link to={"/explore/people"}>Find Friends</Link>
			</Button>
		</div>
	);
}
