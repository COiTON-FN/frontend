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
import { Fragment, useState } from "react";
import { SEO } from "@/components/shared/seo";

const tagFilterTypes = [
  { label: "All Listings", value: "all" },
  { label: "For Sale", value: "forsale" },
  { label: "Sold Out", value: "sold" },
];

const typeFilterTypes = [
  { label: "All Listings", value: "all" },
  { label: "Building", value: "building" },
  { label: "Land", value: "land" },
];

export default function ListingsPage() {
  const [tagFilter, setTagFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { listings } = useAppSelector((state) => state.listing);

  const filteredListings = listings
    ?.filter((listing) => {
      if (typeFilter === "building")
        return (
          listing?.details?.propertyType === "building" ||
          !listing?.details?.propertyType
        );
      if (typeFilter === "land")
        return listing?.details?.propertyType === "land";
      return true;
    })
    .filter((listing) => {
      if (tagFilter.toLowerCase() === "forsale")
        return listing?.tag.toLowerCase() === "forsale";
      if (tagFilter.toLowerCase() === "sold")
        return listing?.tag.toLowerCase() === "sold";
      return true;
    });

  return (
    <Fragment>
      <SEO page="properties" />

      <div className="flex flex-col gap-4 py-4">
        <div className="overflow-clip rounded-2xl md:rounded-3xl md:border md:bg-background">
          <div className="flex w-full items-center justify-end gap-4 border-b py-6 md:px-8">
            <Select onValueChange={setTypeFilter} defaultValue={typeFilter}>
              <SelectTrigger className="!h-12 w-full !text-sm sm:w-[200px]">
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
            <Select onValueChange={setTagFilter} defaultValue={tagFilter}>
              <SelectTrigger className="!h-12 w-full !text-sm sm:w-[200px]">
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

          {listings.length === 0 ? (
            <div className="mx-auto grid grid-cols-1 gap-4 py-6 md:gap-6 md:p-8 lg:grid-cols-2 2xl:grid-cols-3">
              {[...new Array(9)].map((_, _index) => (
                <div key={_index} className="group rounded-[24px] bg-white">
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
          ) : filteredListings.length === 0 ? (
            <div className="flex aspect-[3.2] w-full flex-col items-center justify-center">
              <BsInbox className="size-16 text-muted-foreground" />
              <p className="text-lg font-normal text-muted-foreground">
                There are no properties found
              </p>
            </div>
          ) : (
            <div className="mx-auto grid grid-cols-1 gap-4 py-6 md:gap-6 md:p-8 lg:grid-cols-2 2xl:grid-cols-3">
              {filteredListings.map((listing: Listing, index: number) => {
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
