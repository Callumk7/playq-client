import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components";
import { User } from "@/types";
import { Note } from "@/types/notes";
import { TrashIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface PlaylistCommentProps {
	comment: Note;
	author: User;
}

export function Comment({ comment, author }: PlaylistCommentProps) {
	const deleteFetcher = useFetcher();
	return (
		<Card className="relative">
			<CardHeader>
				<CardTitle>{author.username}</CardTitle>
			</CardHeader>
			<CardContent>
				{comment.content}
				<Button
					className="absolute top-3 right-3"
					variant={"destructive"}
					size={"icon"}
					onClick={() =>
						deleteFetcher.submit(
							{},
							{ method: "DELETE", action: `/api/notes/${comment.id}` },
						)
					}
				>
					<TrashIcon />
				</Button>
			</CardContent>
		</Card>
	);
}
