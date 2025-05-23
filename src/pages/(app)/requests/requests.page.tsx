/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { CgArrowTopRight } from "react-icons/cg";
import { useNavigate, createSearchParams } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ListingBoard from "@/components/shared/listing-board";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { byteArrayToString } from "@/lib/starknet/utils";
import { cn, generateAvatarFromAddress } from "@/lib/utils";
import { RootState, useAppSelector } from "@/store";
import { Loader } from "lucide-react";

export default function NewListingsPage() {
  const navigate = useNavigate();
  const { getContractInstance } = useContractInstance()
  const { walletAddress } = useAppSelector((state: RootState) => state.wallet);

  const [isLoadingMerchants, setIsLoadingMerchants] = useState(false);
  const [merchants, setMerchants] = useState<any[] | []>([])
  const [accountTypes, setAccountTypes] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);

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

      setIsLoadingMerchants(true)

      try {
        const purchaseRequests = await contract.get_listings_with_purchase_requests(walletAddress);

        const data = await Promise.all(
          purchaseRequests.map(async (req: any) => {
            const result = await contract.get_listing_purchase_requests(Number(req.id));
            const dt = result.map((res: any) => {
              const user = res?.user?.Some;

              return {
                listingId: Number(res?.listing_id),
                requestId: Number(res?.request_id),
                price: Number(res?.price),
                initiator: BigInt(res?.initiator).toString(16),
                user: user
                  ? {
                    address: BigInt(user.address).toString(16),
                    id: Number(user.id),
                    details: byteArrayToString(user.details),
                    user_type: user.user_type?.variant?.Entity ? "Entity" : "Individual"
                  }
                  : null
              };
            })

            return dt.flat();
          })
        );

        setMerchants(data[0]);
        setIsLoadingMerchants(false);
      } catch (error) {
        console.error("Failed to load requests:", error);
        setIsLoadingMerchants(false)
      }
    })();
  }, [getContractInstance, walletAddress]);


  useEffect(() => {
    if (merchants.length > 0) {
      const typeMap: any = {};

      merchants.forEach(({ user }:any) => {
        if (!typeMap[user?.user_type]) {
          typeMap[user?.user_type] = user?.user_type;
        }
      });

      setAccountTypes(Object.values(typeMap));
      setStatus(["Pending", "Approved", "Denied"])
    }
  }, [merchants])

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="rounded-2xl md:rounded-3xl md:border md:bg-background">
        {accountTypes.length > 0 &&
        <ListingBoard listingBoardValue={[
            {
              placeholder: "Account Type",
              options: accountTypes
            },
            {
              placeholder: "Status",
              options: status as unknown as string[]
            },
          ]} />
        }

        <Table className="py-6 md:p-6">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] p-6 text-base font-normal">#ID</TableHead>
              <TableHead className="p-6 text-base font-normal">Merchant Name</TableHead>
              <TableHead className="p-6 text-base font-normal">Account Type</TableHead>
              <TableHead className="p-6 text-base font-normal">Bid Price</TableHead>
              <TableHead className="p-6 text-base font-normal">Status</TableHead>
              <TableHead className="p-6 text-base font-normal">Profile</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingMerchants ? (
              <TableRow className="h-[300px]">
                <TableCell
                  colSpan={6}
                  className="text-base font-normal h-24 text-center tracking-wide"
                >
                  <div className="flex flex-col gap-2 w-full items-center justify-center">
                    <Loader className="size-6 animate-spin" />
                    <p className="text-xs uppercase font-medium">Please wait...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : merchants ? merchants.map((merchant, _key) => {
              const pending = "bg-[#FFFCE4] text-[#725900] border-[#725900]/10";
              // const approved = "bg-[#EBFFE4] text-[#1E7200] border-[#1E7200]/10";
              // const denied = "bg-[#FFE4E4] text-[#720000] border-[#720000]/10";

              return (
                <TableRow key={_key}>
                  <TableCell className="w-[60px] p-6 text-base font-normal">#{merchant?.requestId}</TableCell>
                  <TableCell className="p-6 text-base font-normal">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary size-14 rounded-full overflow-hidden">
                        <img src={generateAvatarFromAddress(`0x${merchant?.initiator}`)} alt={merchant?.user?.details?.name} className="size-full rounded-full" />
                      </div>
                      <p className="text-base font-normal">{merchant?.user?.details?.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 text-base font-normal">{merchant?.user?.user_type}</TableCell>
                  <TableCell className="p-6 text-base font-normal">${Number(merchant.price).toLocaleString()}</TableCell>
                  <TableCell className="p-6 text-base font-normal">
                    <div className={cn("text-xs font-medium px-3 py-1 h-max rounded-md border bg-secondary w-max tracking-wide", pending)}>
                      Pending
                    </div>
                  </TableCell>
                  <TableCell className="p-6 text-base font-normal">
                    <div role="button" onClick={() => goToProfile(merchant?.requestId.toString(), merchant?.listingId.toString())} className="flex items-center gap-2">
                      <p className="text-base font-normal">View Profile</p>
                      <CgArrowTopRight className="size-4" />
                    </div>
                  </TableCell>
                </TableRow>
              )
            }) : (
               <TableRow className="h-[300px]">
                <TableCell
                  colSpan={6}
                  className="text-base font-normal h-24 text-center tracking-wide"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
