import { Separator } from ".";

export function PlaylistTitle({ title }: { title: string }) {
	return (
		<>
			<h1 className="py-2 mt-5 text-3xl font-semibold">{title}</h1>
			<Separator />
		</>
	);
}
