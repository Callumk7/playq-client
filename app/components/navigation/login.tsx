import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { NavigationLink } from ".";
import { User } from "@/types";

export function Login({
	supabase,
  userDetails,
	session,
}: {
	supabase: SupabaseClient;
  userDetails: User;
	session: Session | null;
}) {
	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.log(error);
		}
	};

	return session ? (
		<div className="flex gap-4 items-center">
			<NavigationLink link={{ to: "/profile", name: `${userDetails.username}` }} />
			<Button variant={"outline"} onClick={handleLogout}>
				Sign Out
			</Button>
		</div>
	) : (
		<Button asChild>
			<Link to={"/login"}>Login</Link>
		</Button>
	);
}
