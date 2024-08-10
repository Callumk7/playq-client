import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { User } from "@/types";

interface UserSearchTableProps {
	users: User[];
}

export function UserSearchTable({ users }: UserSearchTableProps) {
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
								<Button variant={"ghost"}>Add</Button>
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
