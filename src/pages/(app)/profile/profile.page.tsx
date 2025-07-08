import { Button, buttonVariants } from "@/components/ui/button";
import {
  formatUser,
  generateAvatarFromAddress,
  truncateAddr,
} from "@/lib/utils";
import { Phone } from "lucide-react";
import { MdVerified } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";
import { byteArrayToString, toHex } from "@/lib/starknet/utils";
import { User } from "@/store/slice/credential.slice";
import { Listing } from "@/store/slice/listing.slice";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { RootState, useAppSelector } from "@/store";
import { SOCIAL } from "../../../components/extension/social-input";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { HiOutlineLink } from "react-icons/hi2";
import { Skeleton } from "@/components/ui/skeleton";
import ListingCard from "@/components/shared/listing-card";
import { RiLink } from "react-icons/ri";
import { SEO } from "@/components/shared/seo";
import { ClipboardCopy } from "@/components/shared/clipboard-copy";
import { SharePopup } from "@/components/shared/share-popup";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");

  const listings = useAppSelector((state: RootState) => state.listing.listings);
  const [agentListings, setAgentListings] = useState<Listing[]>([]);
  const connectedAddress = useAppSelector(
    (state) => state.wallet.walletAddress,
  );

  const [credential, setCredential] = useState<User | null>(null);
  const { getContractInstance } = useContractInstance();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingListings, setIsFetchingListings] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const targetAddress = address || connectedAddress;
      if (!targetAddress) return;

      setIsLoading(true);
      try {
        const contract = getContractInstance();
        if (!contract) throw new Error("Contract not available");

        const user = await contract.get_user(targetAddress);

        if (!user || !user.address) {
          setCredential(null);
          return;
        }

        setCredential(formatUser(user));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setCredential(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [address, connectedAddress, getContractInstance]);

  useEffect(() => {
    if (credential) {
      if (listings.length > 0) {
        setAgentListings(
          listings.filter(
            (ft) => ft.owner.toLowerCase() === credential!.address,
          ),
        );
      } else {
        (async function () {
          setIsFetchingListings(true);
          try {
            const contract = getContractInstance();

            const listings = await contract!.get_user_listings(address);

            const structured: Listing[] = listings.map((listing: any) => {
              const user = listing.owner_details.Some;

              const user_construct = formatUser(user);

              return {
                id: Number(listing.id),
                owner: toHex(listing.owner),
                price: Number(listing.price),
                tag: (listing?.tag as any)?.variant?.Sold ? "Sold" : "ForSale",
                details: byteArrayToString(listing.details),
                owner_details: user_construct,
              };
            });

            setAgentListings(structured);
            setIsFetchingListings(false);
          } catch (error) {
            console.log(error);
            setIsFetchingListings(false);
          } finally {
            setIsFetchingListings(false);
          }
        })();
      }
    }
  }, [address, credential, getContractInstance, listings]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 py-4 sm:gap-6">
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-video w-full rounded-xl sm:aspect-[3.5] sm:rounded-2xl sm:bg-background md:rounded-3xl" />

          <Skeleton className="aspect-video w-full rounded-xl sm:aspect-[1.5] sm:rounded-2xl sm:bg-background md:rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!credential) {
    navigate("/dashboard");
    return null;
  }

  return (
    <Fragment>
      <SEO title={credential?.details?.name} />

      <div className="flex flex-col gap-8 py-4 sm:gap-6">
        <div className="flex flex-col gap-6">
          <div className="w-full bg-background sm:rounded-2xl sm:border md:rounded-3xl">
            <div className="border-b pb-6 sm:p-6 lg:p-10">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="hidden size-28 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-[2.5px] sm:flex sm:p-1 lg:size-32 xl:size-44">
                  <div className="size-full rounded-full bg-background p-[2.5px] sm:p-1">
                    <img
                      src={generateAvatarFromAddress(credential?.address)}
                      alt={credential?.details.name}
                      width={176}
                      height={176}
                      className="rounded-full border object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col py-2">
                  <div className="flex items-center gap-4">
                    <div className="flex size-28 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-[2.5px] sm:hidden sm:p-1 lg:size-32 xl:size-44">
                      <div className="size-full rounded-full bg-background p-[2.5px] sm:p-1">
                        <img
                          src={generateAvatarFromAddress(credential?.address)}
                          alt={credential?.details.name}
                          width={176}
                          height={176}
                          className="rounded-full border object-contain"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <p className="text-xl font-medium capitalize lg:text-2xl">
                          {credential?.details.name}
                        </p>
                        {credential?.verified && (
                          <MdVerified className="size-5 text-primary lg:size-6" />
                        )}
                      </div>
                      <ClipboardCopy
                        value={credential?.address}
                        className="mb-2 mt-1 text-muted-foreground"
                      >
                        <p className="text-sm lg:text-base">
                          {truncateAddr(credential?.address)}
                        </p>
                      </ClipboardCopy>
                      <div className="mb-4 flex items-center gap-2">
                        <svg
                          viewBox="0 0 26 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4 stroke-foreground md:size-5"
                        >
                          <path
                            d="M9.75 23.8336C10.1398 23.8336 11.5817 23.1756 13.0535 21.8596M13.0535 21.8596C14.3085 20.7373 15.5852 19.1366 16.25 17.0576C17.6944 12.5402 9.02777 17.0576 11.9167 20.8221C12.2721 21.2852 12.655 21.6237 13.0535 21.8596ZM13.0535 21.8596C14.7898 22.8867 16.8254 21.9638 18.2044 20.9025C18.626 20.5782 18.8367 20.416 18.9624 20.4665C19.0883 20.517 19.1618 20.8072 19.3089 21.3877C19.7796 23.2453 21.17 24.7447 22.75 22.3283"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21.6667 14.0837V8.54861C21.6667 6.69139 21.6667 5.76278 21.3763 5.02113C20.9097 3.82881 19.9227 2.88833 18.6715 2.44362C17.8932 2.16699 16.9187 2.16699 14.9697 2.16699C11.559 2.16699 9.8536 2.16699 8.49156 2.65109C6.3019 3.42932 4.57471 5.07518 3.75802 7.16172C3.25 8.45963 3.25 10.0847 3.25 13.3349V16.1267C3.25 19.4934 3.25 21.1767 4.16834 22.3457C4.43146 22.6806 4.74351 22.9779 5.09499 23.2287C5.49267 23.5123 5.94708 23.7041 6.5 23.8337"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.25 13.0003C3.25 11.0059 4.86675 9.38922 6.86111 9.38922C7.58238 9.38922 8.43271 9.5156 9.13398 9.3277C9.75706 9.16073 10.2437 8.67406 10.4107 8.05097C10.5986 7.3497 10.4722 6.49937 10.4722 5.7781C10.4722 3.78374 12.089 2.16699 14.0833 2.16699"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm font-medium capitalize md:text-base">
                          {credential?.user_type}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 sm:mt-2">
                    <div className="flex items-center gap-2">
                      {credential?.details?.socials?.map((social: SOCIAL) => {
                        const IconComponent = (() => {
                          switch (social.type) {
                            case "twitter":
                              return FaXTwitter;
                            case "instagram":
                              return FaInstagram;
                            case "telegram":
                              return PiTelegramLogoDuotone;
                            case "linkedin":
                              return FaLinkedin;
                            case "facebook":
                              return FaFacebookF;
                            default:
                              return HiOutlineLink;
                          }
                        })();

                        return (
                          <Link
                            key={social?.id}
                            to={social?.url}
                            target="_blank"
                          >
                            <Button
                              variant={"outline"}
                              size={"icon"}
                              className="size-10 border-primary text-primary hover:bg-transparent hover:text-primary sm:size-11"
                            >
                              <IconComponent className="size-4" />
                            </Button>
                          </Link>
                        );
                      })}
                    </div>

                    <SharePopup
                      title={credential?.details.name}
                      shareUrl={`${window.location.origin}/profile?address=${credential?.address}`}
                      platforms={[
                        "facebook",
                        "linkedin",
                        "telegram",
                        "twitter",
                        "whatsapp",
                      ]}
                    >
                      <button
                        className={buttonVariants({
                          variant: "outline",
                          className: "!gap-2",
                        })}
                      >
                        <RiLink className="size-[18px]" />
                        <span>Copy profile url</span>
                      </button>
                    </SharePopup>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 sm:p-6 lg:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-evenly lg:gap-0 lg:divide-x">
                <div className="flex flex-1 sm:items-center sm:justify-center">
                  <div className="flex max-w-sm flex-1 flex-col gap-2 md:pl-6 lg:gap-4">
                    <p className="text-base font-semibold uppercase md:text-lg">
                      Contact Information
                    </p>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Phone className="size-4" />
                        <p className="line-clamp-1 text-sm font-normal text-foreground lg:text-base">
                          {credential?.details?.phone?.national}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MdAlternateEmail className="size-4" />
                        <p className="line-clamp-1 text-sm font-normal text-foreground lg:text-base">
                          {credential?.details?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 sm:items-center sm:justify-center">
                  <div className="flex max-w-sm flex-1 flex-col gap-2 md:pl-6 lg:gap-4">
                    <p className="text-base font-semibold uppercase md:text-lg">
                      Location
                    </p>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-normal text-foreground lg:text-base">
                          Country:{" "}
                        </p>
                        <p className="line-clamp-1 text-sm font-medium text-foreground lg:text-base">
                          {credential?.details?.region?.country
                            ? credential?.details?.region?.country?.countryName
                            : credential?.details?.region[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-normal text-foreground lg:text-base">
                          State:{" "}
                        </p>
                        <p className="line-clamp-1 text-sm font-medium text-foreground lg:text-base">
                          {credential?.details?.region?.state
                            ? credential?.details?.region?.state?.stateName
                            : credential?.details?.region[1]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-6 border-t bg-background py-6 sm:rounded-2xl sm:border sm:p-6 md:rounded-3xl lg:space-y-10 lg:p-10">
            <p className="text-lg font-semibold uppercase lg:text-xl">
              Agent Listings
            </p>

            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {isFetchingListings ? (
                [...new Array(3)].map((_, _index) => (
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
                ))
              ) : agentListings.length === 0 ? (
                <div className="col-span-3 flex aspect-[2.2] items-center justify-center">
                  <p className="text-base font-medium text-muted-foreground">
                    {address
                      ? `${credential?.details?.name} has no property`
                      : "You don't have any property listed"}
                  </p>
                </div>
              ) : (
                agentListings.map((listing: Listing) => {
                  return <ListingCard key={listing.id} listing={listing} />;
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

// ! TRADING PROFILE

// import { cn } from "@/lib/utils";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { IoBedOutline } from "react-icons/io5";
// import { PiBathtub } from "react-icons/pi";
// import { BiSolidCarGarage } from "react-icons/bi";
// import { TbRulerMeasure } from "react-icons/tb";
// import { Separator } from "@/components/ui/separator";
// import { useSelector } from "react-redux";
// import { RootState, useAppSelector } from "@/store";
// import DoughnutChart from "./_components/doughnut-chart";
// import { useEffect, useState } from "react";
// import { User } from "@/store/slice/credential.slice";
// import { useContractInstance } from "@/hooks/useContractInstance.hook";
// import { byteArrayToString, toHex } from "@/lib/starknet/utils";
// import { toast } from "sonner";
// import { Listing } from "@/store/slice/listing.slice";
// import ProfileCard from "@/components/shared/profile-card";

// export default function ProfilePage() {
//   const { address } = useParams();
//   const credential = useSelector(
//     (state: RootState) => state.credential.credential,
//   );
//   const listings = useAppSelector((state) => state.listing.listings);
//   const [agentListings, setAgentListings] = useState<Listing[]>([]);
//   const connectedAddress = useAppSelector(
//     (state) => state.wallet.walletAddress,
//   );

//   const totalListings = [
//     { label: "Residential", value: 45, color: "#0EA5E9" },
//     { label: "Commercial", value: 4, color: "#22C55E" },
//     { label: "Industrial", value: 25, color: "#EAB308" },
//   ];

//   const propertiesSold = [{ label: "Apartments", value: 35, color: "#6366F1" }];

//   const propertiesRented = [
//     { label: "Residential", value: 45, color: "#0EA5E9" },
//     { label: "Industrial", value: 25, color: "#EAB308" },
//   ];

//   const [credential, setCredential] = useState<User | null>(null);
//   const location = useLocation();
//   const { getContractInstance } = useContractInstance();
//   const [loading, setIsLoading] = useState<boolean>(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const state = location?.state;
//     if (state) {
//       setCredential(state);
//     } else {
//       (async function () {
//         try {
//           if (address?.toLowerCase() === connectedAddress) {
//             setCredential(credential);
//             return;
//           }
//           const contract = getContractInstance();
//           if (!contract) return;
//           setIsLoading(true);
//           const user = await contract.get_user(address);

//           const user_construct: User = {
//             ...user,
//             address: toHex(user.address),
//             id: Number(user.id),
//             details: byteArrayToString(user.details),
//             user_type: user.user_type.variant.Entity ? "Entity" : "Individual",
//           };

//           setCredential(user_construct);
//           setIsLoading(false);
//         } catch (error) {
//           console.log("error", error);
//           toast.error("USER_NOT_FOUND");
//           setIsLoading(false);
//           navigate("/dashboard");
//         }
//       })();
//     }
//   }, [
//     address,
//     connectedAddress,
//     credential,
//     getContractInstance,
//     location?.state,
//     navigate,
//   ]);

//   useEffect(() => {
//     if (credentialStore) {
//       if (listings.length > 0) {
//         setAgentListings(
//           listings.filter(
//             (ft) => ft.owner.toLowerCase() === credentialStore!.address,
//           ),
//         );
//       } else {
//         (async function () {
//           try {
//             const contract = getContractInstance();

//             const listings = await contract!.get_user_listings(address);

//             const structured: Listing[] = listings.map((listing: any) => {
//               const user = listing.owner_details.Some;

//               const user_construct: User = {
//                 ...user,
//                 address: toHex(user.address),
//                 id: Number(user.id),
//                 details: byteArrayToString(user.details),
//                 user_type: user.user_type.variant.Entity
//                   ? "Entity"
//                   : "Individual",
//               };
//               return {
//                 id: Number(listing.id),
//                 owner: toHex(listing.owner),
//                 price: Number(listing.price),
//                 tag: (listing?.tag as any)?.variant?.Sold ? "Sold" : "ForSale",
//                 details: byteArrayToString(listing.details),
//                 owner_details: user_construct,
//               };
//             });

//             // console.log({ structured })

//             setAgentListings(structured);
//           } catch (error) {
//             console.log(error);
//           }
//         })();
//       }
//     }
//   }, [address, credentialStore, getContractInstance, listings]);

//   if (loading) return null;

//   return (
//     <div className="flex flex-col gap-4 py-4">
//       <div className="flex w-full flex-col gap-4 sm:gap-6 md:gap-10">
//         <div className="flex w-full flex-col gap-6 xl:flex-row">
//           <ProfileCard credentialStore={credentialStore} />

//           <div className="flex w-full flex-col gap-6 xl:w-[60%]">
//             <div className="flex flex-1 flex-col rounded-2xl border bg-background p-6 md:p-10"></div>

//             <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3">
//               <DoughnutChart data={totalListings} title="No. of Approvals" />
//               <DoughnutChart
//                 data={propertiesSold}
//                 title="No. of Property Sold"
//               />
//               <DoughnutChart
//                 data={propertiesRented}
//                 title="Properties Rented"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <Separator className="my-2 h-px w-full" />
//       <ListingsSection listings={agentListings} />
//       <SoldListingsSection />
//     </div>
//   );
// }

// interface UserListingsProps {
//   listings: Listing[];
// }
// const ListingsSection = ({ listings }: UserListingsProps) => {
//   const navigate = useNavigate();
//   const [limited, set_limited] = useState(true);

//   if (!listings.length) return null;

//   return (
//     <div className="flex flex-1 flex-col gap-5 py-6 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:p-10">
//       <div className="flex items-end justify-between">
//         <p className="text-xl font-medium md:text-2xl">Agent Listings</p>
//       </div>

//       <div className="flex flex-grow flex-wrap gap-10">
//         {(limited ? listings.slice(0, 2) : listings).map((listing, _index) => (
//           <div
//             key={_index}
//             className="flex w-full flex-col gap-6 lg:h-[400px] lg:w-max lg:shrink-0 lg:flex-row lg:whitespace-nowrap"
//           >
//             <img
//               className="flex aspect-square rounded-2xl bg-secondary object-cover lg:aspect-auto lg:w-[300px]"
//               src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
//               alt=""
//             />
//             {/* <div style={{
//               backgroundImage: `${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`
//             }} className="flex aspect-square rounded-2xl bg-secondary lg:aspect-auto lg:w-[300px]"></div> */}
//             <div className="flex w-full flex-col justify-between gap-2 lg:max-w-[290px]">
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
//                   {listing.details.area}
//                 </p>

//                 <p className="text-lg font-bold tracking-wide text-primary md:text-xl">
//                   ${listing.price.toLocaleString()}
//                 </p>

//                 <div className="mt-4 grid grid-cols-2 gap-2">
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <IoBedOutline className="size-5" />
//                     <span>{listing.details.bedrooms} Bedrooms</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <PiBathtub className="size-5" />
//                     <span>{listing.details.bathrooms} Baths</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <BiSolidCarGarage className="size-5" />
//                     <span>2 Car park</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <TbRulerMeasure className="size-5" />
//                     <span>
//                       {listing.details.propertySize.toLocaleString()} km/sq
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <p className="text-xl font-bold text-primary">Description</p>
//                 <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-base md:text-base">
//                   <span className={cn("line-clamp-2 md:font-normal")}>
//                     {listing?.details?.description}
//                   </span>
//                 </pre>
//               </div>

//               <Button
//                 onClick={() => {
//                   navigate(`/listing/${listing.id}`, { state: listing });
//                 }}
//                 size={"lg"}
//                 className="w-full rounded-full"
//               >
//                 View Listing
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//       {listings.length > 2 ? (
//         <div className="mt-5 flex justify-center">
//           <button
//             onClick={() => set_limited(!limited)}
//             role="button"
//             className="text-sm font-medium text-[#15948A] md:text-base"
//           >
//             {limited ? " View More..." : " View Less..."}
//           </button>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// const SoldListingsSection = () => {
//   return (
//     <div className="flex flex-1 flex-col gap-5 py-6 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:p-10">
//       <div className="flex items-end justify-between">
//         <p className="text-xl font-medium md:text-2xl">Sold Listings</p>
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
