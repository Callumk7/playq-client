import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { PlaylistComment, User } from "@/types";
import { Note } from "@/types/notes";

interface PlaylistCommentProps {
	comment: Note;
	author: User;
}

export function Comment({ comment, author }: PlaylistCommentProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{author.username}</CardTitle>
			</CardHeader>
			<CardContent>{comment.content}</CardContent>
		</Card>
	);
}
