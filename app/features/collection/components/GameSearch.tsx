import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IGDBGame, IGDBGameSchema, IGDBGameSchemaArray } from "@/types/igdb";
import { PlusIcon } from "@radix-ui/react-icons";
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
      <PopoverTrigger className="w-full" asChild>
        <Button>Search</Button>
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
        <ScrollArea className="w-full h-80">
          <div>
            {results
              ? results.map((game) => <SearchResult key={game.id} game={game} />)
              : null}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface SearchResultProps {
  game: IGDBGame;
}

function SearchResult({ game }: SearchResultProps) {
  return (
    <div className="flex justify-between px-2 items-center">
      <div className="flex gap-2 py-2 items-center">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg`}
          alt={game.name}
          width={45}
          height={64}
          className="rounded-md overflow-hidden"
        />
        <div>{game.name}</div>
      </div>
      <Button variant={"secondary"} size={"icon"}>
        <PlusIcon />
      </Button>
    </div>
  );
}
