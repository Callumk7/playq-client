import {
	DialogHeader,
	Dialog,
	DialogContent,
	DialogTitle,
	Button,
} from "@/components";
import { Form } from "@remix-run/react";
import { ReactNode, createContext, useContext, useState } from "react";

interface DeletePlaylistDialogOpenState {
	deletePlaylistDialogOpen: boolean;
	setDeletePlaylistDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// create context with undefined as default value
const DeletePlaylistDialogOpenContext = createContext<DeletePlaylistDialogOpenState | undefined>(
	undefined,
);

interface DeletePlaylistDialogOpenProviderProps {
	children: ReactNode;
}

export function DeletePlaylistDialogOpenProvider({
	children,
}: DeletePlaylistDialogOpenProviderProps) {
	const [deletePlaylistDialogOpen, setDeletePlaylistDialogOpen] = useState<boolean>(false);

	return (
		<DeletePlaylistDialogOpenContext.Provider
			value={{ deletePlaylistDialogOpen, setDeletePlaylistDialogOpen }}
		>
			{children}
		</DeletePlaylistDialogOpenContext.Provider>
	);
}

export function useDeletePlaylistDialogOpen(): DeletePlaylistDialogOpenState {
  const context = useContext(DeletePlaylistDialogOpenContext);
	if (!context) {
		throw new Error(
			"useDeletePlaylistDialogOpen must be used within a DeletePlaylistDialogOpenProvider",
		);
	}
	return context;
}

interface DeletePlaylistDialogProps {
	deletePlaylistDialogOpen: boolean;
	setDeletePlaylistDialogOpen: (dialogOpen: boolean) => void;
	playlistId: string;
}
export function DeletePlaylistDialog({
	deletePlaylistDialogOpen,
	setDeletePlaylistDialogOpen,
	playlistId,
}: DeletePlaylistDialogProps) {
	return (
		<Dialog
			open={deletePlaylistDialogOpen}
			onOpenChange={setDeletePlaylistDialogOpen}
			modal={true}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Are you sure that you really want to delete this playlist?
					</DialogTitle>
				</DialogHeader>
				<div>
					Once you delete a playlist it is impossible to recover. All saved games will be
					lost to the void forever.
				</div>
				<div className="flex gap-6">
					<Form method="delete" action={`/api/playlists/${playlistId}`}>
						<Button variant={"destructive"} type="submit">
							Delete
						</Button>
					</Form>
					<Button
						variant={"outline"}
						type="button"
						onClick={() => setDeletePlaylistDialogOpen(false)}
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
