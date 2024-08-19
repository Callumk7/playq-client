import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { useAppData } from "@/routes/_app/route";
import { User } from "@/types";
import { useFetcher } from "@remix-run/react";

interface UserSearchTableProps {
	users: User[];
	friendIds: string[];
}

export function UserSearchTable({ users, friendIds }: UserSearchTableProps) {
	const { session } = useAppData();
	const fetcher = useFetcher();

	if (users.length > 0) {
		return (
			<Table>
				<TableHeader>
					<TableHead>Username</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Add as friend</TableHead>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>
								{friendIds.includes(user.id) ? (
									<Button
										variant={"ghost"}
										onClick={() =>
											fetcher.submit(
												{ userId: session.user.id, friendId: user.id },
												{ method: "DELETE" },
											)
										}
									>
										Remove
									</Button>
								) : (
									<Button
										variant={"ghost"}
										onClick={() =>
											fetcher.submit(
												{ userId: session.user.id, friendId: user.id },
												{ method: "POST" },
											)
										}
									>
										Add
									</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}

	return (
		<div className="w-full h-[50vh] flex items-center justify-center">
			<p className="font-light text-sm text-foreground-muted">No users found.</p>
		</div>
	);
}
