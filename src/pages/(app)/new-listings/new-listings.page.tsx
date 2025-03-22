export default function NewListingsPage() {
  return (
    <div>NewListingsPage</div>
  )
}



// import ListingBoard from "@/components/shared/listing-board";
// import { Separator } from "@/components/ui/separator";
// import { useContractInstance } from "@/hooks/useContractInstance.hook";
// import { byteArrayToString } from "@/lib/starknet/utils";
// import { cn, generateAvatarFromAddress } from "@/lib/utils";
// import { RootState, useAppSelector } from "@/store";
// import { User } from "@/store/slice/credential.slice";
// import { useEffect, useState } from "react";
// import { CgArrowTopRight } from "react-icons/cg";
// import { useNavigate, createSearchParams } from 'react-router-dom';

// export default function NewListingsPage() {
//     const navigate = useNavigate();
//     const { getContractInstance, getRPCProviderContract } = useContractInstance()
//     const { walletAddress } = useAppSelector((state: RootState) => state.wallet);

//     const [merchants, setMerchants] = useState<any[] | []>([])
//     const [allRequests, setAllRequests] = useState<any>([])

//     const goToProfile = (address: string, requestId: string) => {
//         navigate({
//             pathname: `/approve/${address}`,
//             search: `?${createSearchParams({ requestId })}`,
//         });
//     };

//     useEffect(() => {
//         (async () => {
//           try {
//                if (!walletAddress) return;
//             const contract = getContractInstance();
//             if (!contract) return;
//               const requests = await contract?.get_listings_with_purchase_requests(walletAddress);
//               const structuredRequests = requests.map((req: any) => {
//                   const listingType = req?.listing_type?.variant?.Land ? "Land" : "Building";
//                   const tag = req?.tag?.variant?.Sold ? "Sold" : "ForSale";

//                   return {
//                       id: Number(req?.id),
//                       details: byteArrayToString(req?.details),
//                       listingType,
//                       owner: BigInt(req?.owner).toString(16),
//                       price: Number(req?.price),
//                       tag,
//                         ownerDetails: req?.owner_details,
//                   }
//               })

//               console.log(structuredRequests);
//           } catch (error) {
//             console.error("Failed to load requests:", error);
//           }
//       })()
//     }, [getContractInstance, walletAddress])


//     // useEffect(() => {
//     // (async function () {
//     //     try {
//     //     const contract = window.Wallet?.IsConnected
//     //         ? getContractInstance()
//     //         : getRPCProviderContract();
//     //     if (!contract) return;

//     //     const listings = await contract.get_listings_with_purchase_requests(walletAddress);

//     //     const uniqueListings = Array.from(
//     //         new Map(listings.map((l: any) => [l.id, l])).values()
//     //     );

//     //     const allRequests: any[] = [];

//     //         for (const listing of uniqueListings) {
//     //             if (!listing) return;

//     //         const listingId = listing?.id;
//     //         if (!listingId) continue;

//     //         const requests = await contract.get_listing_purchase_requests(listingId);

//     //         const structuredRequests = requests.map((request: any) => {
//     //         const user = request?.user?.Some;
//     //         const user_construct: User | undefined = user
//     //             ? {
//     //                 ...user,
//     //                 address: user.address ? BigInt(user.address).toString(16) : "0x0",
//     //                 id: Number(user.id ?? 0),
//     //                 details: byteArrayToString(user.details ?? []),
//     //                 user_type: user?.user_type?.variant?.Entity ? "Entity" : "Individual"
//     //             }
//     //             : undefined;

//     //         return {
//     //             listingId: Number(request?.listing_id ?? 0),
//     //             requestId: Number(request?.request_id ?? 0),
//     //             price: Number(request?.price ?? 0),
//     //             owner: request?.initiator ? BigInt(request.initiator).toString(16) : "0x0",
//     //             user: user_construct
//     //         };
//     //         });

//     //         allRequests.push(...structuredRequests);
//     //     }

//     //     // console.log(allRequests);
//     //     setMerchants(allRequests);
//     //     } catch (error) {
//     //     console.error("Failed to load listings:", error);
//     //     }
//     // })();
//     // }, [getContractInstance, getRPCProviderContract, walletAddress]);


//   return (
//     <div className="flex flex-col gap-4 py-4">
//         <div className="h-[200px] w-full rounded-2xl bg-foreground/20 p-[1px] sm:h-[364px] md:rounded-3xl">
//             <div className="flex size-full overflow-hidden rounded-[inherit] bg-[#FCFCFC]"></div>
//           </div>

//           <Separator className="my-2 h-px w-full" />

//         <div className="rounded-2xl md:rounded-3xl md:border md:bg-background">
//               <ListingBoard />

//               <div className="mx-auto grid grid-cols-1 overflow-y-auto py-6 md:p-6">
//                 <div className="flex items-center pb-4 pt-2">
//                     <div className="max-w-[334px] w-full">
//                         <p className="text-base font-normal">Merchant Name</p>
//                     </div>
//                     <div className="max-w-[334px] w-full">
//                         <p className="text-base font-normal">Address</p>
//                     </div>
//                     <div className="max-w-[334px] w-full">
//                         <p className="text-base font-normal">Bid</p>
//                     </div>
//                     <div className="max-w-[334px] w-full">
//                         <p className="text-base font-normal">Status</p>
//                     </div>
//                     <div className="max-w-[334px] w-full">
//                         <p className="text-base font-normal">Profile</p>
//                     </div>
//                   </div>

//                   {merchants.length > 0 ? merchants.map((merchant, _key) => {
//                     //   const statusColor = merchant.status === "pending" ? "text-[#725900] bg-[#FFFCE4]" : merchant.status === "denied" ? "text-[#720000] bg-[#FFE4E4]" : "text-[#1E7200]  bg-[#EBFFE4]";
//                     const statusColor = "text-[#725900] bg-[#FFFCE4]"

//                       return (
//                     <div key={_key} className="flex items-center py-4 border-b last-of-type:border-b-0 last-of-type:pb-0">
//                         <div className="max-w-[334px] w-full flex items-center gap-3">
//                                   <div className="bg-secondary size-14 rounded-full overflow-hidden">
//                                       <img src={generateAvatarFromAddress(merchant?.owner)} alt={merchant?.user?.details?.name} className="size-full rounded-full" />
//                             </div>
//                             <p className="text-base font-normal">{merchant?.user?.details?.name}</p>
//                         </div>
//                         <div className="max-w-[334px] w-full flex items-center gap-3">
//                             <p className="text-base font-normal">{merchant?.user?.user_type}</p>
//                         </div>
//                         <div className="max-w-[334px] w-full flex items-center gap-3">
//                             <p className="text-base font-normal">{merchant.price}</p>
//                         </div>
//                         <div className="max-w-[334px] w-full flex items-center gap-3">
//                             <p className={cn("text-xs tracking-wide font-medium py-1.5 px-3 capitalize rounded-md", statusColor)}>Pending</p>
//                         </div>
//                         <div role="button" onClick={() => goToProfile(merchant?.owner, merchant?.requestId.toString())}  className="max-w-[334px] w-full flex items-center gap-2">
//                             <p className="text-base font-normal">View Profile</p>
//                             <CgArrowTopRight className="size-4" />
//                         </div>
//                     </div>
//                       )
//                   }) : <div className="bg-secondary flex items-center py-4 justify-center">
//                   <p>Nothing to display</p></div>}
//               </div>
//         </div>
//     </div>
//   )
// }
