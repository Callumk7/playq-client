import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { createServerClient, getSession } from "@/features/auth";
import { getCollectionGameIds } from "@/features/collection";
import { ExploreGameInternal } from "@/features/explore/components/search-game";
import { useRouteData } from "@/features/explore/hooks/use-initial-data";
import { markInternalResultsAsSaved } from "@/features/explore/lib/mark-results-as-saved";
import { GameCover, LibraryView } from "@/features/library";
import { GameListItemInternal } from "@/features/library/components/game-list-item";
import { ListView } from "@/features/library/components/list-view";
import { ArrowLeftIcon, ArrowRightIcon, ViewGridIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { games } from "db/schema/games";
import { SQL, and, desc, ilike, isNotNull } from "drizzle-orm";
import { useEffect, useRef, useState } from "react";
import { redirect, typedjson } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // AUTH
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);
  if (!session) {
    return redirect("/?index", {
      headers,
    });
  }

  // use the URL for shared state.
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const offset = url.searchParams.get("offset");

  // This is the filter properties for drizzle-orm
  let where: SQL<unknown> | undefined = undefined;
  if (!search) {
    where = isNotNull(games.aggregatedRating);
  } else {
    where = and(isNotNull(games.aggregatedRating), ilike(games.title, `%${search}%`));
  }

  const searchResults = await db.query.games.findMany({
    limit: 50,
    with: {
      cover: true,
    },
    orderBy: [desc(games.aggregatedRating)],
    where: where,
    offset: Number(offset) ?? 0,
  });

  // this mutates the shape of the result
  const gameIds = await getCollectionGameIds(session.user.id);
  const resultsMarkedAsSaved = markInternalResultsAsSaved(searchResults, gameIds);

  return typedjson({ resultsMarkedAsSaved, session });
};

export default function ExploreRoute() {
  const { data, fetcher } = useRouteData<typeof loader>();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [view, setView] = useState<"card" | "list">("list");

  const handleIncreaseOffset = () => {
    const newOffset = offset + 51;
    setOffset(newOffset);
  };

  const handleDecreaseOffset = () => {
    const newOffset = offset - 51;
    if (newOffset <= 0) {
      setOffset(0);
    } else {
      setOffset(newOffset);
    }
  };

  // React has no built in way to only run an effect when the dependency
  // array changes. As such, I am using this useRef trick to not submit
  // the fetcher on the initial render, as we have the data we need from
  // The loader already.
  const formRef = useRef<HTMLFormElement | null>(null);
  const initialRender = useRef(true);
  useEffect(() => {
    if (!initialRender.current) {
      fetcher.submit(formRef.current);
    } else {
      initialRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]); // This effect runs whenever 'offset' changes

  return (
    <div className="mb-12">
      <div className="flex flex-col gap-y-6">
        <div className="flex gap-3">
          <fetcher.Form
            ref={formRef}
            method="get"
            className="flex gap-3"
            onSubmit={() => setOffset(0)}
          >
            <Input
              name="search"
              type="search"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[360px]" // This needs to be responsive
            />
            <input type="hidden" value={offset} name="offset" />
            <Button variant={"outline"}>Search</Button>
          </fetcher.Form>
          <Button variant={"outline"}>Advanced Filters</Button>
        </div>
        <OffsetAndViewControls
          setView={setView}
          handleDecreaseOffset={handleDecreaseOffset}
          handleIncreaseOffset={handleIncreaseOffset}
        />
        {view === "card" ? (
          <LibraryView>
            {data.resultsMarkedAsSaved.map((game) => (
              <ExploreGameInternal
                key={game.id}
                game={game}
                userId={data.session.user.id}
              />
            ))}
          </LibraryView>
        ) : (
          <ListView>
            {data.resultsMarkedAsSaved.map((game) => (
              <GameListItemInternal
                key={game.id}
                game={game}
                userId={data.session.user.id}
              />
            ))}
          </ListView>
        )}
        <OffsetAndViewControls
          setView={setView}
          handleDecreaseOffset={handleDecreaseOffset}
          handleIncreaseOffset={handleIncreaseOffset}
        />
      </div>
    </div>
  );
}

interface OffsetNavigationProps {
  handleDecreaseOffset: () => void;
  handleIncreaseOffset: () => void;
}

function OffsetNavigation({
  handleIncreaseOffset,
  handleDecreaseOffset,
}: OffsetNavigationProps) {
  return (
    <div className="flex gap-2">
      <Button variant={"outline"} size={"icon"} onClick={handleDecreaseOffset}>
        <ArrowLeftIcon />
      </Button>
      <Button variant={"outline"} size={"icon"} onClick={handleIncreaseOffset}>
        <ArrowRightIcon />
      </Button>
    </div>
  );
}

interface OffsetAndViewControlsProps extends OffsetNavigationProps {
  setView: (view: "list" | "card") => void;
}

function OffsetAndViewControls({
  handleIncreaseOffset,
  handleDecreaseOffset,
  setView,
}: OffsetAndViewControlsProps) {
  return (
    <div className="flex gap-2">
      <Toggle
        variant={"outline"}
        size={"icon"}
        onPressedChange={(p) => (p ? setView("card") : setView("list"))}
      >
        <ViewGridIcon />
      </Toggle>
      <OffsetNavigation
        handleIncreaseOffset={handleIncreaseOffset}
        handleDecreaseOffset={handleDecreaseOffset}
      />
    </div>
  );
}
