import ListingBoard from "@/components/shared/listing-board";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CgArrowTopRight } from "react-icons/cg";
import { useNavigate, createSearchParams } from 'react-router-dom';

export default function NewListingsPage() {
    const navigate = useNavigate();

    const goToProfile = (address: string, propsery: string) => {
        navigate({
            pathname: `/approve/${address}`,
            search: `?${createSearchParams({ propsery })}`,
        });
    };

    const merchants = [
        {
            name: "David Odinegun",
            address: "Business",
            bid: "$28,000",
            status: "pending",
            account: "0x565c68e8f2492b1c7542c35ed48b066d32f23ad6896a3f6499d35331469f18f",
        },
        {
            name: "David Odinegun",
            address: "Business",
            bid: "$28,000",
            status: "approved",
            account: "0x565c68e8f2492b1c7542c35ed48b066d32f23ad6896a3f6499d35331469f18f",
        },
        {
            name: "David Odinegun",
            address: "Business",
            bid: "$28,000",
            status: "denied",
            account: "0x565c68e8f2492b1c7542c35ed48b066d32f23ad6896a3f6499d35331469f18f",
        },
        {
            name: "David Odinegun",
            address: "Business",
            bid: "$28,000",
            status: "pending",
            account: "0x565c68e8f2492b1c7542c35ed48b066d32f23ad6896a3f6499d35331469f18f",
        },
        {
            name: "David Odinegun",
            address: "Business",
            bid: "$28,000",
            status: "approved",
            account: "0x565c68e8f2492b1c7542c35ed48b066d32f23ad6896a3f6499d35331469f18f",
        },
        {
            name: "David Odinegun",
            address: "Business",
            bid: "$28,000",
            status: "denied",
            account: "0x565c68e8f2492b1c7542c35ed48b066d32f23ad6896a3f6499d35331469f18f",
        },
    ]

  return (
    <div className="flex flex-col gap-4 py-4">
        <div className="h-[200px] w-full rounded-2xl bg-foreground/20 p-[1px] sm:h-[364px] md:rounded-3xl">
            <div className="flex size-full overflow-hidden rounded-[inherit] bg-[#FCFCFC]"></div>
          </div>

          <Separator className="my-2 h-px w-full" />

        <div className="rounded-2xl md:rounded-3xl md:border md:bg-background">
              <ListingBoard />

              <div className="mx-auto grid grid-cols-1 overflow-y-auto py-6 md:p-6">
                <div className="flex items-center pb-4 pt-2">
                    <div className="max-w-[334px] w-full">
                        <p className="text-base font-normal">Merchant Name</p>
                    </div>
                    <div className="max-w-[334px] w-full">
                        <p className="text-base font-normal">Address</p>
                    </div>
                    <div className="max-w-[334px] w-full">
                        <p className="text-base font-normal">Bid</p>
                    </div>
                    <div className="max-w-[334px] w-full">
                        <p className="text-base font-normal">Status</p>
                    </div>
                    <div className="max-w-[334px] w-full">
                        <p className="text-base font-normal">Profile</p>
                    </div>
                  </div>

                  {merchants.map((merchant, _key) => {
                      const statusColor = merchant.status === "pending" ? "text-[#725900] bg-[#FFFCE4]" : merchant.status === "denied" ? "text-[#720000] bg-[#FFE4E4]" : "text-[#1E7200]  bg-[#EBFFE4]";

                      return (
                    <div key={_key} className="flex items-center py-4 border-b last-of-type:border-b-0 last-of-type:pb-0">
                        <div className="max-w-[334px] w-full flex items-center gap-3">
                            <div className="bg-secondary size-14 rounded-full"></div>
                            <p className="text-base font-normal">{merchant.name}</p>
                        </div>
                        <div className="max-w-[334px] w-full flex items-center gap-3">
                            <p className="text-base font-normal">{merchant.address}</p>
                        </div>
                        <div className="max-w-[334px] w-full flex items-center gap-3">
                            <p className="text-base font-normal">{merchant.bid}</p>
                        </div>
                        <div className="max-w-[334px] w-full flex items-center gap-3">
                            <p className={cn("text-xs tracking-wide font-medium py-1.5 px-3 capitalize rounded-md", statusColor)}>{merchant.status}</p>
                        </div>
                        <div role="button" onClick={() => goToProfile(merchant.account, (_key + 1).toString())}  className="max-w-[334px] w-full flex items-center gap-2">
                            <p className="text-base font-normal">View Profile</p>
                            <CgArrowTopRight className="size-4" />
                        </div>
                    </div>
                )})}
              </div>
        </div>
    </div>
  )
}
