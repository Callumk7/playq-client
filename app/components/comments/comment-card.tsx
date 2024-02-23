import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components";
import { User } from "@/types";
import { Note } from "@/types/notes";
import { ChatBubbleIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { ButtonWithTooltip } from "../ui/custom/button-with-tooltip";

interface PlaylistCommentProps {
	comment: Note;
	author: User;
}

export function Comment({ comment, author }: PlaylistCommentProps) {
	return (
		<Card className="relative">
			<CardHeader>
				<CardTitle>{author.username}</CardTitle>
			</CardHeader>
			<CardContent>
				{comment.content}
				<CommentControls comment={comment} author={author} />
			</CardContent>
		</Card>
	);
}

function CommentControls({ comment, author }: PlaylistCommentProps) {
	const deleteFetcher = useFetcher();
	return (
		<div className="absolute top-3 right-3 flex gap-3">
      <ButtonWithTooltip tooltip="Reply">
        <ChatBubbleIcon />
      </ButtonWithTooltip>
      <ButtonWithTooltip tooltip="Edit">
        <Pencil1Icon />
      </ButtonWithTooltip>
			<ButtonWithTooltip
        tooltip="Delete"
				variant={"destructive"}
				onClick={() =>
					deleteFetcher.submit(
						{},
						{ method: "DELETE", action: `/api/notes/${comment.id}` },
					)
				}
			>
				<TrashIcon />
			</ButtonWithTooltip>
		</div>
	);
}
