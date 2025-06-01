import { useEffect, useState } from "react";
import { CgArrowTopRight } from "react-icons/cg";
import { useNavigate, createSearchParams } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import ListingBoard from "@/components/shared/listing-board";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { byteArrayToString, toHex } from "@/lib/starknet/utils";
import { cn, generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { RootState, useAppSelector } from "@/store";
import { Loader } from "lucide-react";
import { MdVerified } from "react-icons/md";

export default function NewListingsPage() {
  const navigate = useNavigate();
  const { getContractInstance } = useContractInstance();
  const { walletAddress } = useAppSelector((state: RootState) => state.wallet);

  const [isLoadingMerchants, setIsLoadingMerchants] = useState(false);
  const [merchants, setMerchants] = useState<any[] | []>([]);
  // const [accountTypes, setAccountTypes] = useState<string[]>([]);
  // const [status, setStatus] = useState<string[]>([]);

  const goToProfile = (requestId: string, listingId: string) => {
    navigate({
      pathname: `/approve`,
      search: `?${createSearchParams({ requestId, listingId })}`,
    });
  };

  useEffect(() => {
    (async () => {
      if (!walletAddress) return;
      const contract = getContractInstance();
      if (!contract) return;

      setIsLoadingMerchants(true);

      try {
        const purchaseRequests =
          await contract.get_listings_with_purchase_requests(walletAddress);

        const data = await Promise.all(
          purchaseRequests.map(async (req: any) => {
            const result = await contract.get_listing_purchase_requests(
              Number(req.id),
            );
            const dt = result.map((res: any) => {
              const user = res?.user?.Some;

              return {
                listingId: Number(res?.listing_id),
                requestId: Number(res?.request_id),
                price: Number(res?.price),
                initiator: toHex(res?.initiator),
                user: user
                  ? {
                      address: toHex(user.address),
                      id: Number(user.id),
                      details: byteArrayToString(user.details),
                      registered: user.registered,
                      verified: user.verified,
                      user_type: user.user_type?.variant?.Entity
                        ? "Entity"
                        : "Individual",
                    }
                  : null,
              };
            });

            return dt.flat();
          }),
        );

        console.log(data[0]);
        setMerchants(data[0]);
        setIsLoadingMerchants(false);
      } catch (error) {
        console.error("Failed to load requests:", error);
        setIsLoadingMerchants(false);
      }
    })();
  }, [walletAddress, getContractInstance]);

  // useEffect(() => {
  //   if (merchants && merchants?.length > 0) {
  //     const typeMap: any = {};

  //     merchants.forEach(({ user }: any) => {
  //       if (!typeMap[user?.user_type]) {
  //         typeMap[user?.user_type] = user?.user_type;
  //       }
  //     });

  //     setAccountTypes(Object.values(typeMap));
  //     setStatus(["Pending", "Approved", "Denied"]);
  //   }
  // }, [merchants]);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="rounded-2xl md:rounded-3xl md:border md:bg-background">
        {/* {accountTypes && accountTypes?.length > 0 && (
          <ListingBoard
            listingBoardValue={[
              {
                placeholder: "Account Type",
                options: accountTypes,
              },
              {
                placeholder: "Status",
                options: status as unknown as string[],
              },
            ]}
          />
        )} */}

        <Table className="py-6 md:p-6">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] p-6 text-base font-normal">
                #ID
              </TableHead>
              <TableHead className="p-6 text-base font-normal">
                Merchant Name
              </TableHead>
              <TableHead className="p-6 text-base font-normal">
                Account Type
              </TableHead>
              <TableHead className="p-6 text-base font-normal">
                Bid Price
              </TableHead>
              <TableHead className="p-6 text-base font-normal">
                Status
              </TableHead>
              <TableHead className="p-6 text-base font-normal">
                Profile
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingMerchants ? (
              <TableRow className="h-[300px]">
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-base font-normal tracking-wide"
                >
                  <div className="flex w-full flex-col items-center justify-center gap-2">
                    <Loader className="size-6 animate-spin" />
                    <p className="text-xs font-medium uppercase">
                      Please wait...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : merchants ? (
              merchants.map((merchant, _key) => {
                const pending =
                  "bg-[#FFFCE4] text-[#725900] border-[#725900]/10";
                // const approved = "bg-[#EBFFE4] text-[#1E7200] border-[#1E7200]/10";
                // const denied = "bg-[#FFE4E4] text-[#720000] border-[#720000]/10";

                return (
                  <TableRow key={_key}>
                    <TableCell className="w-[60px] p-6 text-base font-normal">
                      #{merchant?.requestId}
                    </TableCell>
                    <TableCell className="p-6 text-base font-normal">
                      <div className="flex items-center gap-2">
                        <div className="size-12 rounded-[12px] border p-0.5">
                          <div className="size-full rounded-[10px] border bg-[#C0D9BF]">
                            <img
                              src={generateAvatarFromAddress(
                                merchant?.initiator,
                              )}
                              alt={merchant?.user?.details?.name}
                              width={48}
                              height={48}
                              className="rounded-[8px] object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <p className="text-base font-medium text-foreground transition-colors group-hover:text-primary">
                              {merchant?.user.details.name}
                            </p>
                            {merchant?.user?.verified && (
                              <MdVerified className="mt-px size-4 text-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {truncateAddr(merchant?.initiator)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-6 text-base font-normal">
                      {merchant?.user?.user_type}
                    </TableCell>
                    <TableCell className="p-6 text-base font-normal">
                      ${Number(merchant.price).toLocaleString()}
                    </TableCell>
                    <TableCell className="p-6 text-base font-normal">
                      <div
                        className={cn(
                          "h-max w-max rounded-md border bg-secondary px-3 py-1 text-xs font-medium tracking-wide",
                          pending,
                        )}
                      >
                        Pending
                      </div>
                    </TableCell>
                    <TableCell className="p-6 text-base font-normal">
                      <div
                        role="button"
                        onClick={() =>
                          goToProfile(
                            merchant?.requestId.toString(),
                            merchant?.listingId.toString(),
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <p className="text-base font-normal">View Profile</p>
                        <CgArrowTopRight className="size-4" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="h-[300px]">
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-base font-normal tracking-wide"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
