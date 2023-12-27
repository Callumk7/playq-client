import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IGDBGenre } from "@/types/igdb";
import { useState } from "react";

export function GenreFilter({
  genres,
  genreFilter,
  setGenreFilter,
}: {
  genres: IGDBGenre[];
  genreFilter: number[];
  setGenreFilter: (genreFilter: number[]) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Filter by Genre</Button>
      </PopoverTrigger>
      <PopoverContent>
        {genres.map((genre) => (
          <GenreFilterCheckbox
            key={genre.id}
            genre={genre}
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}

function GenreFilterCheckbox({
  genre,
  genreFilter,
  setGenreFilter,
}: {
  genre: IGDBGenre;
  genreFilter: number[];
  setGenreFilter: (genreFilter: number[]) => void;
}) {
  const [isChecked, setIsChecked] = useState(() => genreFilter.includes(genre.id));

  const handleCheckedChanged = () => {
    setIsChecked(!isChecked);
    if (isChecked) {
      setGenreFilter(genreFilter.filter((id) => id !== genre.id));
    } else {
      setGenreFilter([...genreFilter, genre.id]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={isChecked} onCheckedChange={handleCheckedChanged} />
      <span>{genre.name}</span>
    </div>
  );
}
