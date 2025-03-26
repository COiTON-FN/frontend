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
import { Separator } from "@/components/ui/separator";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { byteArrayToString } from "@/lib/starknet/utils";
import { generateAvatarFromAddress } from "@/lib/utils";
import { RootState, useAppSelector } from "@/store";

export default function NewListingsPage() {
  const navigate = useNavigate();
  const { getContractInstance } = useContractInstance()
  const { walletAddress } = useAppSelector((state: RootState) => state.wallet);

  const [merchants, setMerchants] = useState<any[] | []>([])

  const goToProfile = (requestId: string, listingId: string) => {
    navigate({
      pathname: `/approve`,
      search: `?${createSearchParams({ requestId, listingId })}`,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        if (!walletAddress) return;

        const contract = getContractInstance();
        if (!contract) return;

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
      } catch (error) {
        console.error("Failed to load requests:", error);
      }
    })();
  }, [getContractInstance, walletAddress]);



  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="h-[200px] w-full rounded-2xl bg-foreground/20 p-[1px] sm:h-[364px] md:rounded-3xl">
        <div className="flex size-full overflow-hidden rounded-[inherit] bg-[#FCFCFC]"></div>
      </div>

      <Separator className="my-2 h-px w-full" />

      <div className="rounded-2xl md:rounded-3xl md:border md:bg-background">
        <ListingBoard />

        <Table className="py-6 md:p-6">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-6 text-base font-normal">#ID</TableHead>
              <TableHead className="p-6 text-base font-normal">Merchant Name</TableHead>
              <TableHead className="p-6 text-base font-normal">Account Type</TableHead>
              <TableHead className="p-6 text-base font-normal">Bid Price</TableHead>
              <TableHead className="p-6 text-base font-normal">Profile</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.length > 0 ? merchants.map((merchant, _key) => {
              return (
                <TableRow key={_key}>
                  <TableCell className="w-[100px] p-6 text-base font-normal">#{merchant?.requestId}</TableCell>
                  <TableCell className="p-6 text-base font-normal">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary size-14 rounded-full overflow-hidden">
                        <img src={generateAvatarFromAddress(`0x${merchant?.initiator}`)} alt={merchant?.user?.details?.name} className="size-full rounded-full" />
                      </div>
                      <p className="text-base font-normal">{merchant?.user?.details?.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="p-6 text-base font-normal">{merchant?.user?.user_type}</TableCell>
                  <TableCell className="p-6 text-base font-normal">{Number(merchant.price).toLocaleString()}</TableCell>
                  <TableCell className="p-6 text-base font-normal">
                    <div role="button" onClick={() => goToProfile(merchant?.requestId.toString(), merchant?.listingId.toString())} className="flex items-center gap-2">
                      <p className="text-base font-normal">View Profile</p>
                      <CgArrowTopRight className="size-4" />
                    </div>
                  </TableCell>
                </TableRow>
              )
            }) : (
              <TableRow className="bg-secondary py-4 h-[150px]">
                <TableCell colSpan={1} className="text-base font-normal h-24 text-center">Nothing to display</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
