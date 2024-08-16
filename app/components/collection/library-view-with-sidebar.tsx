import { ReactNode } from "react";

export function LibraryViewWithSidebar({
	children,
	sidebar,
}: { children: ReactNode; sidebar: ReactNode }) {
	return (
		<div className="grid relative gap-10 lg:grid-cols-12">
			<div className="flex flex-col gap-5 lg:col-span-9">{children}</div>
			<div className="relative lg:col-span-3">
				<div className="flex flex-col gap-8 h-full">{sidebar}</div>
			</div>
		</div>
	);
}
