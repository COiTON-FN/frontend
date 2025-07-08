import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ListingCard from "@/components/shared/listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store";
import { Listing } from "@/store/slice/listing.slice";
import { BsInbox } from "react-icons/bs";
import { Fragment, useEffect, useState } from "react";
import { SEO } from "@/components/shared/seo";
import { useSearchParams } from "react-router-dom";
import { useSearchFilter } from "@/hooks/useSearchFilter.hook";
import { SearchInput } from "@/components/shared/search-input";

const tagFilterTypes = [
  { label: "Property Status", value: "default" },
  { label: "– For Sale –", value: "forsale" },
  { label: "– Sold Out –", value: "sold" },
];

const typeFilterTypes = [
  { label: "Listing Type", value: "default" },
  { label: "– Building –", value: "building" },
  { label: "– Land –", value: "land" },
];

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const init = (key: string, def: string) => searchParams.get(key) ?? def;

  const [tagFilter, setTagFilter] = useState(init("tag", "default"));
  const [typeFilter, setTypeFilter] = useState(init("type", "default"));

  const { listings } = useAppSelector((state) => state.listing);

  const filteredByTagAndType = listings
    .filter((l) => {
      if (typeFilter === "building") return l.details?.propertyType !== "land";
      if (typeFilter === "land") return l.details?.propertyType === "land";
      return true;
    })
    .filter((l) => {
      if (tagFilter === "forsale") return l.tag.toLowerCase() === "forsale";
      if (tagFilter === "sold") return l.tag.toLowerCase() === "sold";
      return true;
    });

  const { search, setSearch, filtered } = useSearchFilter(
    filteredByTagAndType,
    [(l) => l.details.title, (l) => l.owner_details?.details.name],
    init("search", ""),
  );

  useEffect(() => {
    const params: Record<string, string> = {};
    if (tagFilter !== "default") params.tag = tagFilter;
    if (typeFilter !== "default") params.type = typeFilter;
    if (search) params.search = search;
    setSearchParams(params, { replace: true });
  }, [tagFilter, typeFilter, search, setSearchParams]);

  return (
    <Fragment>
      <SEO page="properties" />

      <div className="flex flex-col gap-4 py-6">
        <div className="flex flex-col gap-8 overflow-clip rounded-2xl py-6 md:rounded-3xl md:border md:bg-background md:px-8">
          <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4 md:flex-col lg:flex-row">
            <SearchInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search property by title or owner"
              className="w-full lg:max-w-md"
            />
            <div className="flex w-full items-center justify-end gap-3 sm:gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="!h-14 w-full !rounded-full !text-sm lg:max-w-[200px]">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {typeFilterTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="text-sm"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="!h-14 w-full !rounded-full !text-sm lg:max-w-[200px]">
                  <SelectValue placeholder="For sale or sold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {tagFilterTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="text-sm"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {[...new Array(9)].map((_, _index) => (
                <div key={_index} className="group rounded-[24px]">
                  <Skeleton className="relative aspect-[1.6] w-full overflow-hidden rounded-[inherit] bg-secondary" />

                  <div className="flex flex-col gap-4 p-6 md:gap-6">
                    <Skeleton className="text-xl font-bold leading-none tracking-wide text-primary md:text-2xl" />

                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-8 w-[90%]" />
                      <Skeleton className="h-6 w-[50%]" />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-1 items-center justify-start gap-2">
                        <Skeleton className="size-6 rounded-full" />

                        <Skeleton className="h-6 flex-1" />
                      </div>
                      <div className="flex flex-1 items-center justify-center gap-2">
                        <Skeleton className="size-6 rounded-full" />

                        <Skeleton className="h-6 flex-1" />
                      </div>
                      <div className="flex flex-1 items-center justify-end gap-2">
                        <Skeleton className="size-6 rounded-full" />

                        <Skeleton className="h-6 flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex aspect-[3.2] w-full flex-col items-center justify-center">
              <BsInbox className="size-16 text-muted-foreground" />
              <p className="text-base font-normal text-muted-foreground">
                There are no properties found
              </p>
            </div>
          ) : (
            <div className="mx-auto grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {filtered.map((listing: Listing, index: number) => {
                return (
                  <ListingCard
                    key={listing.id ?? index}
                    listing={listing}
                    index={index}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
