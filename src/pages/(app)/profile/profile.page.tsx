import { cn} from "@/lib/utils";
import {  useLocation, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";
import { BiSolidCarGarage } from "react-icons/bi";
import { TbRulerMeasure } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState, useAppSelector } from "@/store";
import DoughnutChart from "./_components/doughnut-chart";
import { useEffect, useState } from "react";
import { User } from "@/store/slice/credential.slice";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { byteArrayToString } from "@/lib/starknet/utils";
import { toast } from "sonner";
import { Listing } from "@/store/slice/listing.slice";
import ProfileCard from "@/components/shared/profile-card";

export default function ProfilePage() {
  const { address } = useParams();
  const credential = useSelector(
    (state: RootState) => state.credential.credential,
  );
  const listings = useAppSelector(state => state.listing.listings);
  const [agent_listings, set_agent_listings] = useState<Listing[]>([]);
  const connectedAddress = useAppSelector(state => state.wallet.walletAddress);

  const totalListings = [
    { label: "Residential", value: 45, color: "#0EA5E9" },
    { label: "Commercial", value: 4, color: "#22C55E" },
    { label: "Industrial", value: 25, color: "#EAB308" },
  ];

  const propertiesSold = [{ label: "Apartments", value: 35, color: "#6366F1" }];

  const propertiesRented = [
    { label: "Residential", value: 45, color: "#0EA5E9" },
    { label: "Industrial", value: 25, color: "#EAB308" },
  ];


  const [credentialStore, setCredential] = useState<User | null>(null);
  const location = useLocation();
  const { getContractInstance, getRPCProviderContract } = useContractInstance()
  const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

  useEffect(() => {
    const state = location?.state;
    if (state) {
      setCredential(state);
    } else {
      (async function () {
        try {
          if (address?.toLowerCase() === connectedAddress) {
            setCredential(credential);
            return;
          }
          const contract = window.Wallet?.IsConnected ? getContractInstance() : getRPCProviderContract();
          if (!contract) return;
          setLoading(true);
          const user = await contract.get_user(address);

          const user_construct: User = {
            ...user,
            address: BigInt(user.address).toString(16),
            id: Number(user.id),
            details: byteArrayToString(user.details),
            user_type: user.user_type.variant.Entity ? "Entity" : "Individual",
          }

          setCredential(user_construct);
          setLoading(false)
        } catch (error) {
          console.log("error", error)
          toast.error("USER_NOT_FOUND");
          setLoading(false)
          navigate("/dashboard");
        }
      }())
    }
  }, [address, connectedAddress, credential, getContractInstance, getRPCProviderContract, location?.state, navigate])


  useEffect(() => {
    if (credentialStore) {
      if (listings.length > 0) {
        set_agent_listings(listings.filter(ft => ft.owner.toLowerCase() === credentialStore!.address));

      } else {
        (async function () {
          try {
            const contract = window.Wallet?.IsConnected ? getContractInstance() : getRPCProviderContract();

            const listings = await contract!.get_user_listings(address);

            const structured: Listing[] = listings.map((listing: any) => {
              const user = listing.owner_details.Some;

              const user_construct: User = {
                ...user,
                address: BigInt(user.address).toString(16),
                id: Number(user.id),
                details: byteArrayToString(user.details),
                user_type: user.user_type.variant.Entity ? "Entity" : "Individual"
              }
              return {
                id: Number(listing.id),
                owner: BigInt(listing.owner).toString(16),
                price: Number(listing.price),
                tag: (listing?.tag as any)?.variant?.Sold ? "Sold" : "ForSale",
                details: byteArrayToString(listing.details),
                owner_details: user_construct
              }
            })

            // console.log({ structured })

            set_agent_listings(structured);
          } catch (error) {
            console.log(error)

          }
        }())
      }
    }
  }, [address, credentialStore, getContractInstance, getRPCProviderContract, listings])


  if (loading) return null;


  return (
    <div className="flex flex-col gap-4 py-4">

      <div className="flex w-full flex-col gap-4 sm:gap-6 md:gap-10">
        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <ProfileCard credentialStore={credentialStore} />

          <div className="flex w-full flex-col gap-6 xl:w-[60%]">
            <div className="flex flex-1 flex-col rounded-2xl border bg-background p-6 md:p-10"></div>

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3">
              <DoughnutChart data={totalListings} title="No. of Approvals" />
              <DoughnutChart
                data={propertiesSold}
                title="No. of Property Sold"
              />
              <DoughnutChart
                data={propertiesRented}
                title="Properties Rented"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />
      <ListingsSection listings={agent_listings} />
      <SoldListingsSection />
    </div>
  );
}

interface UserListingsProps {
  listings: Listing[]
}
const ListingsSection = ({ listings }: UserListingsProps) => {
  const navigate = useNavigate();
  const [limited, set_limited] = useState(true);

  if (!listings.length) return null;

  return (
    <div className="flex flex-1 flex-col gap-5 py-6 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:p-10">
      <div className="flex items-end justify-between">
        <p className="text-xl font-medium md:text-2xl">Agent Listings</p>

      </div>

      <div className="flex flex-grow flex-wrap gap-10">

        {(limited ? listings.slice(0, 2) : listings).map((listing, _index) => (
          <div
            key={_index}
            className="flex w-full flex-col gap-6 lg:h-[400px] lg:w-max lg:shrink-0 lg:flex-row lg:whitespace-nowrap"
          >

            <img className="flex aspect-square rounded-2xl bg-secondary lg:aspect-auto lg:w-[300px] object-cover" src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`} alt="" />
            {/* <div style={{
              backgroundImage: `${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`
            }} className="flex aspect-square rounded-2xl bg-secondary lg:aspect-auto lg:w-[300px]"></div> */}
            <div className="flex w-full flex-col justify-between gap-2 lg:max-w-[290px]">
              <div className="flex flex-col gap-2">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="rounded-sm bg-[#DEEDEC] px-3 py-1 text-sm font-medium tracking-wide text-primary">
                    High Confidence
                  </div>
                  <div className="rounded-sm bg-[#FFF2DA] px-3 py-1 text-sm font-medium tracking-wide text-[#C28000]">
                    High Confidence
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-base font-medium tracking-wide md:text-lg">
                  {listing.details.area}
                </p>

                <p className="text-lg font-bold tracking-wide text-primary md:text-xl">
                  ${listing.price.toLocaleString()}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IoBedOutline className="size-5" />
                    <span>{listing.details.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PiBathtub className="size-5" />
                    <span>{listing.details.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BiSolidCarGarage className="size-5" />
                    <span>2 Car park</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TbRulerMeasure className="size-5" />
                    <span>{listing.details.propertySize.toLocaleString()} km/sq</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold text-primary">Description</p>
                <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-base md:text-base">
                  <span
                    className={cn("md:font-normal line-clamp-2")}
                  >
                    {listing?.details?.description}
                  </span>
                </pre>
              </div>

              <Button onClick={() => {
                navigate(`/listing/${listing.id}`, { state: listing })
              }} size={"lg"} className="w-full rounded-full">
                View Listing
              </Button>
            </div>
          </div>
        ))}


      </div>
      {listings.length > 2 ? <div className="mt-5 flex justify-center">
        <button
          onClick={() => set_limited(!limited)}
          role="button"
          className="text-sm font-medium text-[#15948A] md:text-base"
        >
          {limited ? " View More..." : " View Less..."}
        </button>
      </div> : null}
    </div>
  );
};

const SoldListingsSection = () => {
  return (
    <div className="flex flex-1 flex-col gap-5 py-6 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:p-10">
      <div className="flex items-end justify-between">
        <p className="text-xl font-medium md:text-2xl">Sold Listings</p>
        <p
          role="button"
          className="text-sm font-medium text-[#15948A] md:text-base"
        >
          View More
        </p>
      </div>

      <div className="flex flex-grow flex-wrap gap-10">
        {[...new Array(2)].map((_, _index) => (
          <div
            key={_index}
            className="flex w-full flex-col gap-6 lg:h-[400px] lg:w-max lg:shrink-0 lg:flex-row lg:whitespace-nowrap"
          >
            <div className="flex aspect-square rounded-2xl bg-secondary lg:aspect-auto lg:w-[300px]"></div>
            <div className="flex w-full flex-col justify-between gap-10 lg:max-w-[290px]">
              <div className="flex flex-col gap-2">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="rounded-sm bg-[#DEEDEC] px-3 py-1 text-sm font-medium tracking-wide text-primary">
                    High Confidence
                  </div>
                  <div className="rounded-sm bg-[#FFF2DA] px-3 py-1 text-sm font-medium tracking-wide text-[#C28000]">
                    High Confidence
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-base font-medium tracking-wide md:text-lg">
                  423E Magic Lane, Lekki Phase 3, WA 12343
                </p>

                <p className="text-lg font-bold tracking-wide text-primary md:text-xl">
                  $450,000
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IoBedOutline className="size-5" />
                    <span>4 Bedroom</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PiBathtub className="size-5" />
                    <span>3 Baths</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BiSolidCarGarage className="size-5" />
                    <span>2 Car park</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TbRulerMeasure className="size-5" />
                    <span>32 km/sq</span>
                  </div>
                </div>
              </div>

              <Button size={"lg"} className="w-full rounded-full">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// const ProposalsSection = ({ address }: { address: string }) => {
//   const avatar = createAvatar(lorelei, {
//     seed: `address-${address as string}`,
//   });

//   const svg = avatar.toDataUri();

//   return (
//     <div className="flex flex-1 flex-col gap-5 py-6 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:p-10">
//       <div className="flex items-end justify-between">
//         <p className="text-xl font-medium md:text-2xl">Proposals</p>
//         <p
//           role="button"
//           className="text-sm font-medium text-[#15948A] md:text-base"
//         >
//           View More
//         </p>
//       </div>

//       <div className="flex flex-grow flex-wrap gap-10">
//         {[...new Array(2)].map((_, _index) => (
//           <div
//             key={_index}
//             className="flex w-full flex-col gap-6 lg:h-[400px] lg:w-max lg:shrink-0 lg:flex-row lg:whitespace-nowrap"
//           >
//             <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#EAF6F5] bg-secondary lg:aspect-auto lg:w-[300px]">
//               <div className="flex size-[109px] items-center justify-center rounded-full border border-[#C8ECEA] bg-[#DCF0EE]">
//                 <svg
//                   width="50"
//                   height="50"
//                   viewBox="0 0 50 50"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M15.668 10.2012H33.2005C34.9092 10.2012 36.2945 11.5864 36.2945 13.2951V16.3891"
//                     stroke="#056F67"
//                     strokeWidth="1.59689"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M31.1376 26.7021H18.7617"
//                     stroke="#056F67"
//                     strokeWidth="1.59689"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M24.9497 34.9531H18.7617"
//                     stroke="#056F67"
//                     strokeWidth="1.59689"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path
//                     d="M38.3515 4.12598L13.2092 4.12602C12.1842 4.12602 11.1357 4.27643 10.3071 4.88466C7.67989 6.81318 5.65521 11.1143 9.7439 14.9974C10.8919 16.0877 12.4966 16.4829 14.074 16.4829H37.9111C39.5479 16.4829 42.483 16.7172 42.483 21.7148V37.0896C42.483 41.6676 38.7915 45.379 34.2378 45.379H15.6118C11.0665 45.379 7.76076 42.1666 7.49963 37.2754L7.43055 10.6571"
//                     stroke="#056F67"
//                     strokeWidth="1.59689"
//                     strokeLinecap="round"
//                   />{" "}
//                 </svg>
//               </div>
//             </div>
//             <div className="flex w-full flex-col justify-between gap-10 lg:max-w-[290px]">
//               <div className="flex flex-col gap-2">
//                 <div className="mb-4 flex items-center justify-between gap-4">
//                   <div className="rounded-sm bg-[#DEEDEC] px-3 py-1 text-sm font-medium tracking-wide text-primary">
//                     High Confidence
//                   </div>
//                   <div className="rounded-sm bg-[#FFF2DA] px-3 py-1 text-sm font-medium tracking-wide text-[#C28000]">
//                     High Confidence
//                   </div>
//                 </div>

//                 <p className="whitespace-pre-wrap text-base font-medium tracking-wide md:text-lg">
//                   Coiton is the best, Argue with your Keybaord
//                 </p>

//                 <div className="mt-4 flex items-center gap-2">
//                   <div className="size-10 rounded-full border">
//                     <img
//                       src={svg}
//                       alt={address as string}
//                       width={40}
//                       height={40}
//                       className="size-full rounded-full object-cover"
//                     />
//                   </div>
//                   <p className="text-base font-medium md:text-lg">Coitoneer</p>
//                   <div className="rounded-full border border-muted-foreground/60 px-3 py-1 text-xs font-medium text-muted-foreground">
//                     Core
//                   </div>
//                 </div>
//               </div>

//               <Button size={"lg"} className="w-full rounded-full">
//                 View Details
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ApprovalsSection = () => {
//   return (
//     <div className="flex flex-1 flex-col gap-5 py-6 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:p-10">
//       <div className="flex items-end justify-between">
//         <p className="text-xl font-medium md:text-2xl">Pending Listings</p>
//         <p
//           role="button"
//           className="text-sm font-medium text-[#15948A] md:text-base"
//         >
//           View More
//         </p>
//       </div>

//       <div className="flex flex-grow flex-wrap gap-10">
//         {[...new Array(2)].map((_, _index) => (
//           <div
//             key={_index}
//             className="flex w-full flex-col gap-6 lg:h-[400px] lg:w-max lg:shrink-0 lg:flex-row lg:whitespace-nowrap"
//           >
//             <div className="flex aspect-square rounded-2xl bg-secondary lg:aspect-auto lg:w-[300px]"></div>
//             <div className="flex w-full flex-col justify-between gap-10 lg:max-w-[290px]">
//               <div className="flex flex-col gap-2">
//                 <div className="mb-4 flex items-center justify-between gap-4">
//                   <div className="rounded-sm bg-[#DEEDEC] px-3 py-1 text-sm font-medium tracking-wide text-primary">
//                     High Confidence
//                   </div>
//                   <div className="rounded-sm bg-[#FFF2DA] px-3 py-1 text-sm font-medium tracking-wide text-[#C28000]">
//                     High Confidence
//                   </div>
//                 </div>

//                 <p className="whitespace-pre-wrap text-base font-medium tracking-wide md:text-lg">
//                   423E Magic Lane, Lekki Phase 3, WA 12343
//                 </p>

//                 <p className="text-lg font-bold tracking-wide text-primary md:text-xl">
//                   $450,000
//                 </p>

//                 <div className="mt-4 grid grid-cols-2 gap-2">
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <IoBedOutline className="size-5" />
//                     <span>4 Bedroom</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <PiBathtub className="size-5" />
//                     <span>3 Baths</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <BiSolidCarGarage className="size-5" />
//                     <span>2 Car park</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <TbRulerMeasure className="size-5" />
//                     <span>32 km/sq</span>
//                   </div>
//                 </div>
//               </div>

//               <Button size={"lg"} className="w-full rounded-full">
//                 View Details
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
