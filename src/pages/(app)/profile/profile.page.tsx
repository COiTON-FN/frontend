
import { cn, copyToClipboard, generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { TbCopy } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { IoBedOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";
import { BiSolidCarGarage } from "react-icons/bi";
import { TbRulerMeasure } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { RootState, useAppSelector } from "@/store";
import DoughnutChart from "./_components/doughnut-chart";
import { SOCIAL } from "../onboarding/_components/social-input";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { HiOutlineLink } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { User } from "@/store/slice/credential.slice";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { byteArrayToString } from "@/lib/starknet/utils";
import { toast } from "sonner";
import { Verified } from "lucide-react";
import { Listing } from "@/store/slice/listing.slice";

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
  const [_, setLoading] = useState<boolean>(false);
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
  }, [])


  useEffect(() => {
    if (credentialStore) {
      if (listings.length > 0) {
        set_agent_listings(listings.filter(ft => ft.owner.toLowerCase() === credentialStore!.address));

      } else {
        (async function () {
          try {
            const contract = window.Wallet?.IsConnected ? getContractInstance() : getRPCProviderContract();

            const listings = await contract!.get_user_listings(address);

            let structured: Listing[] = listings.map((listing: any) => {
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
                tag: listing.tag.variant.Sold ? "Sold" : "ForSale",
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
  }, [credentialStore])


  return (
    <div className="flex flex-col gap-4 py-4">
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}

      <div className="flex w-full flex-col gap-4 sm:gap-6 md:gap-10">
        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <div className="flex w-full flex-col rounded-2xl sm:border sm:bg-background xl:w-[40%]">
            <div className="flex flex-col gap-4 border-b py-6 sm:p-6 md:gap-10 md:p-10">
              <div className="size-32 rounded-full bg-secondary md:size-48">
                <img
                  src={generateAvatarFromAddress(address?.toLowerCase().trim() === connectedAddress?.trim().toLowerCase() ? connectedAddress! : address!)}
                  alt={address as string}
                  width={192}
                  height={192}
                  className="size-full rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="mb-2 text-2xl font-medium md:text-3xl capitalize">
                    {credentialStore?.details?.name}
                  </p>
                  {credentialStore?.user_type === "Entity" ? credentialStore.verified ? <Verified color="#3b82f6" /> : <div className="border border-red-500 rounded-full py-1 px-3 text-sm text-red-500 font-bold">Not verified</div> : null}
                </div>

                {credentialStore?.user_type === "Entity" ? <div className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 md:size-[26px]"
                  >
                    <path
                      d="M9.75 23.8336C10.1398 23.8336 11.5817 23.1756 13.0535 21.8596M13.0535 21.8596C14.3085 20.7373 15.5852 19.1366 16.25 17.0576C17.6944 12.5402 9.02777 17.0576 11.9167 20.8221C12.2721 21.2852 12.655 21.6237 13.0535 21.8596ZM13.0535 21.8596C14.7898 22.8867 16.8254 21.9638 18.2044 20.9025C18.626 20.5782 18.8367 20.416 18.9624 20.4665C19.0883 20.517 19.1618 20.8072 19.3089 21.3877C19.7796 23.2453 21.17 24.7447 22.75 22.3283"
                      stroke="#141B34"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.6667 14.0837V8.54861C21.6667 6.69139 21.6667 5.76278 21.3763 5.02113C20.9097 3.82881 19.9227 2.88833 18.6715 2.44362C17.8932 2.16699 16.9187 2.16699 14.9697 2.16699C11.559 2.16699 9.8536 2.16699 8.49156 2.65109C6.3019 3.42932 4.57471 5.07518 3.75802 7.16172C3.25 8.45963 3.25 10.0847 3.25 13.3349V16.1267C3.25 19.4934 3.25 21.1767 4.16834 22.3457C4.43146 22.6806 4.74351 22.9779 5.09499 23.2287C5.49267 23.5123 5.94708 23.7041 6.5 23.8337"
                      stroke="#141B34"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.25 13.0003C3.25 11.0059 4.86675 9.38922 6.86111 9.38922C7.58238 9.38922 8.43271 9.5156 9.13398 9.3277C9.75706 9.16073 10.2437 8.67406 10.4107 8.05097C10.5986 7.3497 10.4722 6.49937 10.4722 5.7781C10.4722 3.78374 12.089 2.16699 14.0833 2.16699"
                      stroke="#141B34"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-base font-medium md:text-lg">Agent</p>
                  <div className="rounded-full border border-muted-foreground/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                    Core
                  </div>
                </div> : null}

                {address && (
                  <div className="flex items-center gap-3 md:gap-4">
                    <p className="text-sm font-medium md:text-base">
                      {truncateAddr(address as string)}
                    </p>
                    <TbCopy
                      role="button"
                      onClick={() => copyToClipboard(address as string)}
                      className="size-4 md:size-5"
                    />
                  </div>
                )}

                {/* <div
                className={cn(
                  "flex w-max items-center gap-2 rounded-full border px-4 py-2",
                  {
                    "border-[#00605A] bg-[#C8FFFB] text-[#004843]": isActive,
                    "border-[#D12E2E] bg-[#FFD3D3] text-[#D12E2E]": !isActive,
                  }
                )}
              >
                <span
                  className={cn("size-2 rounded-full", {
                    "bg-[#004843]": isActive,
                    "bg-[#D12E2E]": !isActive,
                  })}
                />
                <span className="font-sans_medium text-sm">
                  {isActive ? "Active" : "Closed"}
                </span>
              </div> */}
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[750px] flex-col gap-4 py-6 sm:p-6 md:gap-6 md:p-10 xl:max-w-[500px]">
              <div className="flex items-center justify-between">
                <p className="w-full max-w-[125px] text-sm text-muted-foreground sm:text-base md:text-lg">
                  Country
                </p>
                <p className="text-sm font-medium sm:text-base md:text-lg">
                  {credentialStore?.details?.region?.country?.countryName}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="w-full max-w-[125px] text-sm text-muted-foreground sm:text-base md:text-lg">
                  State
                </p>
                <p className="text-sm font-medium sm:text-base md:text-lg">
                  {credentialStore?.details?.region?.state?.stateName}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="w-full max-w-[125px] text-sm text-muted-foreground sm:text-base md:text-lg">
                  Phone
                </p>
                <p className="text-sm font-medium sm:text-base md:text-lg">
                  {credentialStore?.details?.phone?.national}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="w-full max-w-[125px] text-sm text-muted-foreground sm:text-base md:text-lg">
                  Email
                </p>
                <p className="text-sm font-medium sm:text-base md:text-lg">
                  {credentialStore?.details?.email}
                </p>
              </div>

              <div className="mx-auto mt-6 flex items-center justify-start w-full gap-2">
                {credentialStore?.details?.socials?.map((social: SOCIAL) => {
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
                    <Link key={social?.id} to={social?.url} target="_blank">
                      <Button size={"icon"} className="rounded-[8px]">
                        <IconComponent className="size-6" />
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

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
      <Separator className="my-2 h-px w-full" />
      <ProposalsSection address={address!} />
      <ApprovalsSection />
    </div>
  );
}

interface UserListingsProps {
  listings: Listing[]
}
const ListingsSection = ({ listings }: UserListingsProps) => {
  const navigate = useNavigate();
  const [limited, set_limited] = useState(true);

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

const ProposalsSection = ({ address }: { address: string }) => {
  const avatar = createAvatar(lorelei, {
    seed: `address-${address as string}`,
  });

  const svg = avatar.toDataUri();

  return (
    <div className="flex flex-1 flex-col gap-5 py-6 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:p-10">
      <div className="flex items-end justify-between">
        <p className="text-xl font-medium md:text-2xl">Proposals</p>
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
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#EAF6F5] bg-secondary lg:aspect-auto lg:w-[300px]">
              <div className="flex size-[109px] items-center justify-center rounded-full border border-[#C8ECEA] bg-[#DCF0EE]">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.668 10.2012H33.2005C34.9092 10.2012 36.2945 11.5864 36.2945 13.2951V16.3891"
                    stroke="#056F67"
                    strokeWidth="1.59689"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.1376 26.7021H18.7617"
                    stroke="#056F67"
                    strokeWidth="1.59689"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24.9497 34.9531H18.7617"
                    stroke="#056F67"
                    strokeWidth="1.59689"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M38.3515 4.12598L13.2092 4.12602C12.1842 4.12602 11.1357 4.27643 10.3071 4.88466C7.67989 6.81318 5.65521 11.1143 9.7439 14.9974C10.8919 16.0877 12.4966 16.4829 14.074 16.4829H37.9111C39.5479 16.4829 42.483 16.7172 42.483 21.7148V37.0896C42.483 41.6676 38.7915 45.379 34.2378 45.379H15.6118C11.0665 45.379 7.76076 42.1666 7.49963 37.2754L7.43055 10.6571"
                    stroke="#056F67"
                    strokeWidth="1.59689"
                    strokeLinecap="round"
                  />{" "}
                </svg>
              </div>
            </div>
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
                  Coiton is the best, Argue with your Keybaord
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="size-10 rounded-full border">
                    <img
                      src={svg}
                      alt={address as string}
                      width={40}
                      height={40}
                      className="size-full rounded-full object-cover"
                    />
                  </div>
                  <p className="text-base font-medium md:text-lg">Coitoneer</p>
                  <div className="rounded-full border border-muted-foreground/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                    Core
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

const ApprovalsSection = () => {
  return (
    <div className="flex flex-1 flex-col gap-5 py-6 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:p-10">
      <div className="flex items-end justify-between">
        <p className="text-xl font-medium md:text-2xl">Pending Listings</p>
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
