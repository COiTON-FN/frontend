import { useState, useMemo } from "react";

export function useSearchFilter<T extends object>(
  items: T[],
  keyExtractors: ((item: T) => string)[],
  initialSearch = "",
) {
  const [search, setSearch] = useState(initialSearch);

  const filtered = useMemo(() => {
    if (!search) return items;
    const term = search.toLowerCase();
    return items.filter((item) =>
      keyExtractors.some((fn) => fn(item).toLowerCase().includes(term)),
    );
  }, [items, search, keyExtractors]);

  return { search, setSearch, filtered };
}
