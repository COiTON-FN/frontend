import ListingBoard from "@/components/shared/listing-board";
import ListingCard from "@/components/shared/listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import { byteArrayToString, toHex } from "@/lib/starknet/utils";
import { useAppSelector } from "@/store";
import { Listing } from "@/store/slice/listing.slice";
import { contract } from "@/utils/contract";
import { BsInbox } from "react-icons/bs";

export default function BuyOrRentPage() {

  const { listings } = useAppSelector(state => state.listing);



  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="rounded-2xl md:rounded-3xl md:border md:bg-background">
        <ListingBoard />

        {listings.length === 0 ? (
          <div className="mx-auto grid grid-cols-1 gap-4 overflow-y-auto py-6 md:gap-6 md:p-6 lg:grid-cols-2 2xl:grid-cols-3">
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
        ) : listings.length === 0 ? (
          <div className="flex aspect-[3.2] w-full flex-col items-center justify-center">
            <BsInbox className="size-24 text-muted-foreground" />
            <p className="text-xl font-medium text-muted-foreground">
              No active property
            </p>
          </div>
        ) : (
          <div className="mx-auto grid grid-cols-1 gap-4 overflow-y-auto py-6 md:gap-6 md:p-6 lg:grid-cols-2 2xl:grid-cols-3">
            {listings.map((listing: Listing) => {
              return <ListingCard key={listing.id} listing={listing} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
