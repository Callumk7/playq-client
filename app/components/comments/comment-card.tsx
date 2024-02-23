import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components";
import { User } from "@/types";
import { Note } from "@/types/notes";
import { ChatBubbleIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { IconButtonWithTooltip } from "../ui/custom/icon-with-tooltip";

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
      <IconButtonWithTooltip tooltip="Reply">
        <ChatBubbleIcon />
      </IconButtonWithTooltip>
      <IconButtonWithTooltip tooltip="Edit">
        <Pencil1Icon />
      </IconButtonWithTooltip>
			<IconButtonWithTooltip
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
			</IconButtonWithTooltip>
		</div>
	);
}
