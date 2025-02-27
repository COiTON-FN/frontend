import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type FilterProps = {
  search?: string;
  type?: string;
  country?: string;
};

export const useFilterHook = () => {
  const [filterParams, setFilterParams] = useSearchParams();

  const filterProperty = filterParams.get("search") as FilterProps["search"];
  const filterCountry = filterParams.get("country") as FilterProps["country"];
  const filterPropertyType = filterParams.get("type") as FilterProps["type"];

  const setFilters = useCallback((filters?: FilterProps) => {
    setFilterParams((params) => {
      if (filters?.search !== undefined) {
        params.set("search", filters?.search);
      }

      if (filters?.country) {
        params.set("country", filters?.country);
      }

      if (filters?.type) {
        params.set("type", filters?.type);
      }

      return params;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilterParams(new URLSearchParams());
  }, []);

  return {
    filterProperty,
    filterCountry,
    filterPropertyType,
    setFilters,
    resetFilters,
  };
};
