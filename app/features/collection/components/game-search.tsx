import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaveToCollectionButton } from "@/features/explore/components/save-to-collection-button";
import { IGDBGame, IGDBGameSchema, IGDBGameSchemaArray } from "@/types/igdb";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

interface GameSearchProps {
  userId: string;
}

export function GameSearch({ userId }: GameSearchProps) {
  const [results, setResults] = useState<IGDBGame[]>([]);
  const fetcher = useFetcher();

  // WARN: If this fails, then the page crashes. This error should be handled
  // such that the search component is disabled, but not the entire page.
  useEffect(() => {
    if (fetcher.data) {
      const typedResults = IGDBGameSchemaArray.parse(fetcher.data);
      setResults(typedResults);
    }
  }, [fetcher.data]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="w-40 flex gap-4">
          <span>Add more</span>
          <MagnifyingGlassIcon className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px]">
        <fetcher.Form method="get" action="/api/search" className="w-full">
          <Input
            name="search"
            placeholder="Search for a game"
            onChange={(e) => fetcher.submit(e.target.form)}
            className="w-full"
            autoComplete="off"
          />
        </fetcher.Form>
        <ScrollArea className="h-80 w-full">
          <div>
            {results
              ? results.map((game) => (
                  <SearchResult key={game.id} game={game} userId={userId} />
                ))
              : null}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface SearchResultProps {
  game: IGDBGame;
  userId: string;
}

function SearchResult({ game, userId }: SearchResultProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2 py-2">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg`}
          alt={game.name}
          width={45}
          height={64}
          className="overflow-hidden rounded-md"
        />
        <div>{game.name}</div>
      </div>
      <SaveToCollectionButton gameId={game.id} userId={userId} />
    </div>
  );
}
