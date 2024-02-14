import {
	GameSortAndFilterMenu,
	Input,
	ExternalSearchDialog,
	Toggle,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components";
import { useFilterStore } from "@/store/filters";
import { TableIcon } from "@radix-ui/react-icons";

interface CollectionMenubarProps {
	userId: string;
	isTableView: boolean;
	setIsTableView: (isTableView: boolean) => void;
}

export function CollectionMenubar({
	userId,
	isTableView,
	setIsTableView,
}: CollectionMenubarProps) {
	const searchTerm = useFilterStore((state) => state.searchTerm);
	const setSearchTerm = useFilterStore((state) => state.setSearchTerm);

	return (
		<div className="flex justify-between">
			<div className="flex w-full justify-start gap-4">
				<ExternalSearchDialog userId={userId} />
				<GameSortAndFilterMenu />
				<Tooltip>
					<TooltipTrigger>
						<Toggle
							variant={"outline"}
							pressed={isTableView}
							onPressedChange={() => setIsTableView(!isTableView)}
						>
							<TableIcon />
						</Toggle>
					</TooltipTrigger>
					<TooltipContent>{isTableView ? "Grid view" : "Table view"}</TooltipContent>
				</Tooltip>
			</div>
			<Input
				name="search"
				type="search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.currentTarget.value)}
				placeholder="Search your collection"
			/>
		</div>
	);
}
