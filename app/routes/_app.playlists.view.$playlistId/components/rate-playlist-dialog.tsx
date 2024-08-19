import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Label,
	Slider,
} from "@/components";
import { useAppData } from "@/routes/_app/route";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface RatePlaylistDialogProps {
	playlistId: string;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export function RatePlaylistDialog({
	playlistId,
	isOpen,
	setIsOpen,
}: RatePlaylistDialogProps) {
	const { session } = useAppData();
	const fetcher = useFetcher();
	const [rating, setRating] = useState(0);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rate this Playlist</DialogTitle>
				</DialogHeader>
				<fetcher.Form
					action={`/api/playlists/${playlistId}/ratings`}
					method="POST"
					onSubmit={() => setIsOpen(false)}
				>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="rating">Rating: {rating}</Label>
							<Slider
								value={[rating]}
								onValueChange={(v) => setRating(v[0])}
								name="rating"
								id="rating"
							/>
						</div>
						<input type="hidden" value={session.user.id} name="user_id" />
						<Button variant={"outline"} size={"sm"} type="submit">
							Submit
						</Button>
					</div>
				</fetcher.Form>
			</DialogContent>
		</Dialog>
	);
}
