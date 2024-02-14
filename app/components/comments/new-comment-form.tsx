import { useFetcher } from "@remix-run/react";
import { Button, Label, TextArea } from "..";

interface NewCommentFormProps {
	userId: string;
	action: string;
}
export function NewCommentForm({ action, userId }: NewCommentFormProps) {
	const fetcher = useFetcher();
	return (
		<fetcher.Form className="flex flex-col gap-3" method="POST" action={action}>
			<TextArea
				className="resize-none h-36"
				placeholder="What have you got to say?"
				name="body"
			/>
			<input type="hidden" name="user_id" value={userId} />
			<Button>Post</Button>
		</fetcher.Form>
	);
}
