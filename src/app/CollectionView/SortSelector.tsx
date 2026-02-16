type SortOption =
  | "created_desc"
  | "created_asc"
  | "title_asc"
  | "title_desc"
  | "done_asc"
  | "done_desc";

export default function SortSelector({
  sortOption,
  setSortOption,
}: {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}) {
  return (
    <div className="flex gap-2 items-center my-2">
      <label htmlFor="sort-option" className="text-sm">
        Sort by:
      </label>
      <select
        id="sort-option"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        className="border rounded p-1 text-sm dark:bg-gray-600"
      >
        <option value="created_desc">Created (newest)</option>
        <option value="created_asc">Created (oldest)</option>
        <option value="title_asc">Title (A-Z)</option>
        <option value="title_desc">Title (Z-A)</option>
        <option value="done_asc">Status (Todo first)</option>
        <option value="done_desc">Status (Done first)</option>
      </select>
    </div>
  );
}
