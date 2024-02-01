import { Tag } from "@/components/ui/tag";
import useFilterStore from "@/store/filters";

interface GenreFilterProps {
  genres: string[];
}

export function GenreFilter({ genres }: GenreFilterProps) {
  const genreFilter = useFilterStore((state) => state.genreFilter);
  const handleToggleAllGenres = useFilterStore((state) => state.handleToggleAllGenres);
  const handleGenreToggled = useFilterStore((state) => state.handleGenreToggled);
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
