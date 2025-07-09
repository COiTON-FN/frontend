import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site.config";
import { RootState, useAppSelector } from "@/store";
import { User } from "@/store/slice/credential.slice";
import { Listing } from "@/store/slice/listing.slice";
import { TbCloudSearch } from "react-icons/tb";
import { UserAvatar } from "./user-avatar";

interface GlobalSearchProps {
  children: React.ReactNode;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const users = useAppSelector((state: RootState) => state.users.users);
  const listings = useAppSelector((state: RootState) => state.listing.listings);

  const query = searchValue.toLowerCase().trim();

  const filteredUsers = query
    ? users.filter(
        (user) =>
          user.details.name.toLowerCase().includes(query) ||
          user.address.toLowerCase().includes(query),
      )
    : users.slice(0, 1).reverse();

  const filteredListings = query
    ? listings.filter(
        (listing) =>
          listing.details.title.toLowerCase().includes(query) ||
          listing.details.description.toLowerCase().includes(query),
      )
    : listings.slice(-1).reverse();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <span onClick={() => setOpen((prev) => !prev)} className="flex-1">
        {children}
      </span>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder="Search for people and listings..."
          className="!rounded-2xl"
        />
        <CommandList>
          <CommandEmpty className="flex aspect-video flex-col items-center justify-center">
            <TbCloudSearch className="size-20 opacity-50" />
            <p>No results found.</p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              We couldn't find any results for{" "}
              <span className="text-foreground">"{searchValue}"</span>. <br />
              Try adjusting your search or use a different keyword.
            </p>
          </CommandEmpty>

          {filteredListings.length > 0 && (
            <>
              <CommandGroup
                heading={`Listed Properties - ${searchValue ? filteredListings.length : listings.length}`}
              >
                {filteredListings.map((listing: Listing) => (
                  <Link
                    key={listing.id}
                    to={`/properties/${listing.id}`}
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    <CommandItem className="flex !h-auto items-center gap-2 !px-5 py-2">
                      <div className="flex flex-1 items-center justify-between gap-6">
                        <span className="line-clamp-1">
                          {listing.details.title}
                        </span>
                        <span className="text-sm text-primary dark:text-green-600">
                          ${listing.price.toLocaleString()}
                        </span>
                      </div>
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {filteredUsers.length > 0 && (
            <>
              <CommandGroup
                heading={`Registered Users - ${searchValue ? filteredUsers.length : users.length}`}
              >
                {filteredUsers.map((user: User) => (
                  <Link
                    key={user.id}
                    to={`/profile?address=${user.address}`}
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    <CommandItem className="flex !h-auto items-center gap-3 py-2 !pl-4">
                      <UserAvatar user={user} parentClass="gap-3" />
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="Others">
            <Link
              target="_blank"
              to={siteConfig.social.telegram}
              onClick={() => setOpen((prev) => !prev)}
            >
              <CommandItem className="!px-5">
                <span>Telegram Community</span>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
