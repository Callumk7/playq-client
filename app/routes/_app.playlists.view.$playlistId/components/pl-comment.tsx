import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { PlaylistComment, User } from "@/types";

interface PlaylistCommentProps {
  comment: PlaylistComment;
  author: User;
}
export function Comment({comment, author}: PlaylistCommentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{author.username}</CardTitle>
      </CardHeader>
      <CardContent>{comment.body}</CardContent>
    </Card>
  )
}
