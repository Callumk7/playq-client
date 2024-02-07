import { Tag } from "@/components/ui/tag";

interface GenreFilterProps {
  genres: string[];
  genreFilter: string[];
  handleGenreToggled: (genre: string) => void;
  handleToggleAllGenres: (genres: string[]) => void;
}

export function GenreFilter({
  genres,
  genreFilter,
  handleGenreToggled,
  handleToggleAllGenres,
}: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 self-start">
      <button type="button" onClick={() => handleToggleAllGenres(genres)}>
        <Tag variant={genreFilter.length === genres.length ? "primary" : "secondary"}>
          All
        </Tag>
      </button>
      {genres.map((genre) => (
        <button type="button" onClick={() => handleGenreToggled(genre)} key={genre}>
          <Tag variant={genreFilter.includes(genre) ? "primary" : "default"} key={genre}>
            {genre}
          </Tag>
        </button>
      ))}
    </div>
  );
}
