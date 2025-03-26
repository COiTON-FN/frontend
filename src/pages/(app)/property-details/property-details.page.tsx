import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import { Helmet } from "react-helmet-async"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { PiFolderOpenDuotone } from "react-icons/pi";
import { RxOpenInNewWindow } from "react-icons/rx";

import { byteArrayToString } from "@/lib/starknet/utils";
import { useEffect, useRef, useState } from "react";
import { cn, formatDate, generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { Link as LinkIcon, Loader, Share2, Verified, X } from "lucide-react";
import { BiLeaf } from "react-icons/bi";
import { toast } from "sonner";
import { Listing, PurchaseRequest } from "@/store/slice/listing.slice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/store/slice/credential.slice";
import { useWalletHook } from "@/hooks/useWallet.hook";
import { useAppSelector } from "@/store";
import BID from "../../../assets/images/bid.png";
import BID_LG from "../../../assets/images/bid_lg.png";
import { Input } from "@/components/ui/input";
import { CairoOption, CairoOptionVariant } from "starknet";
import { variables } from "@/utils/variables";
import { google, outlook, office365, yahoo, ics, CalendarEvent } from "calendar-link";
import { SiGooglecalendar } from "react-icons/si";
import { ImAppleinc } from "react-icons/im";
import { FaYahoo } from "react-icons/fa";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";
import { CgMicrosoft } from "react-icons/cg";



export default function PropertyDetailsPage() {
  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [property, setProperty] = useState<any>(null)

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [addresses, setAddresses] = useState<{label: string,value:string}[]>([]);
  const [details, setDetails] = useState<{label: string,value:string}[]>([]);
  const { getContractInstance, getRPCProviderContract, getErc20Instance } = useContractInstance()

  const [content, setContent] = useState({ url: window.location.href, message: "" });


  function configureVars(_listing: Listing) {
    setAddresses([
      {
        label: "Address",
        value: _listing?.details.area,
      },
      {
        label: "Area /Landmark",
        value: _listing?.details?.landmark,
      },
      {
        label: "City",
        value: _listing?.details?.region?.city?.cityName,
      },
      {
        label: "State",
        value: _listing?.details?.region?.state?.stateName,
      },
      {
        label: "ZIP",
        value: _listing?.details?.zip,
      },
      {
        label: "Country",
        value: _listing?.details?.region?.country?.countryName,
      },
    ])
    setDetails([
      {
        label: "Property ID",
        value: _listing?.id,
      },
      {
        label: "Price",
        value: `$${_listing?.price.toLocaleString()}`,
      },
      {
        label: "Rooms",
        value: _listing?.details?.rooms,
      },
      {
        label: "Bedrooms",
        value: _listing?.details?.bedrooms,
      },
      {
        label: "Bathrooms",
        value: _listing?.details?.bathrooms,
      },
      {
        label: "Year built",
        value: formatDate(_listing?.details?.yearBuilt),
      },
      {
        label: "Structure type",
        value: _listing?.details?.structureType,
      },
      // {
      //   label: "Property type",
      //   value: _listing?.details?.propertyType,
      // },
      {
        label: "Property Sizes",
        value: _listing?.details?.propertySize,
      },
    ])
  }

  useEffect(() => {
    if (location.state) {
      setListing(location.state);

      configureVars(location.state)

    } else {
      (async function () {
        try {
          const contract = window.Wallet?.IsConnected ? getContractInstance() : getRPCProviderContract();
          setLoading(true);
          if (!contract) return;
          const listing = await contract.get_listing(id);
          const user = listing.owner_details.Some;
          const user_construct: User = {
            ...user,
            address: BigInt(user.address).toString(16),
            id: Number(user.id),
            details: byteArrayToString(user.details),
            user_type: user.user_type.variant.Entity ? "Entity" : "Individual"
          }

          const structured: Listing = {
            id: Number(listing.id),
            owner: BigInt(listing.owner).toString(16),
            price: Number(listing.price),
            tag: listing.tag.variant.Sold ? "Sold" : "ForSale",
            details: byteArrayToString(listing.details),
            owner_details: user_construct
          };


          setListing(structured)
          configureVars(structured);
          setLoading(false)
        } catch (error) {
          console.log(error);
          setLoading(false)
          toast.error("LISTING_NOT_FOUND");
          navigate("/dashboard")
        }
      }())
    }
  }, [])

  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [loadingPurchaseRequests, setLoadingPurchaseRequests] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        if (loadingPurchaseRequests) return;
        setLoadingPurchaseRequests(true);
        const contract = window.Wallet?.IsConnected ? getContractInstance() : getRPCProviderContract();
        const purchase_requests = await contract!.get_listing_purchase_requests(id);

        const structured = purchase_requests.map((request: any) => {
          const user = request.user.Some;

          const user_construct: User = {
            ...user,
            address: BigInt(user.address).toString(16),
            id: Number(user.id),
            details: byteArrayToString(user.details),
            user_type: user.user_type.variant.Entity ? "Entity" : "Individual"
          }

          const request_construct: PurchaseRequest = {
            initiator: BigInt(request.initiator).toString(16),
            listing_id: Number(request.listing_id),
            price: Number(request.price),
            request_id: Number(request.id),
            user: user_construct
          }
          return request_construct
        })


        console.log(structured)
        setPurchaseRequests(structured)
        setLoadingPurchaseRequests(false);
      } catch (error) {
        console.log(error)
        setLoadingPurchaseRequests(false);
      }
    }())
  }, [])



  useEffect(() => {
    setContent({ ...content, message: listing?.details?.title });
  }, [listing])

  const { hasRegistered } = useAppSelector(state => state.wallet);
  const { credential } = useAppSelector(state => state.credential);
  const { walletAddress } = useAppSelector(state => state.wallet)

  const [creatingPurchaseAgreement, setCreatingPurchaseAgreement] = useState<boolean>(false);
  const { handleConnectWallet } = useWalletHook();
  async function createPurchaseAgreement(bidPrice?: number) {
    try {
      if (creatingPurchaseAgreement) return;
      if (!window.Wallet?.IsConnected) {
        await handleConnectWallet();
      }
      if (!hasRegistered) {
        toast.error("NOT_REGISTERED");
        return;
      }
      if (!credential || !credential.address) {
        toast.error("DATA_NOT_FOUND");
        return;
      }
      if (loadingPurchaseRequests) {
        toast.error("LOADING_PURCHASE_REQUESTS");
        return;
      }
      if (parseInt(walletAddress!, 16) === parseInt(listing!.owner, 16)) {
        toast.error("OWNER_CANNOT_PERFORM_ACTION");
        return;
      }

      if (purchaseRequests.length > 0 && purchaseRequests.filter(ft => parseInt(ft.initiator, 16) === parseInt(credential.address, 16)).length > 0) {
        toast.error("ALREADY_CREATED");
        return;
      }
      if (!listing?.owner_details?.verified) {
        toast.error("AGENT_NOT_VERIFIED!");
        return;
      }
      setCreatingPurchaseAgreement(true);
      const contract = getContractInstance();

      const erc20 = getErc20Instance();
      const allowance = await erc20!.allowance(walletAddress, variables.daoAddress);
      const account = window.Wallet.Account!;
      if ((bidPrice || listing.price) > Number(allowance)) {
        const approval_call = erc20!.populate("approve", [
          variables.daoAddress,
          bidPrice || listing.price
        ]);

        const approval_tx = await account.execute(approval_call);
        await account.waitForTransaction(approval_tx.transaction_hash);
      }

      const call = contract!.populate("create_purchase_request", [
        listing.id,
        new CairoOption(CairoOptionVariant.Some, bidPrice || listing.price),
      ])


      const tx = await account?.execute(call);
      await account?.waitForTransaction(tx!.transaction_hash);

      setCreatingPurchaseAgreement(false);
      const new_purchase_request_construct: PurchaseRequest = {
        initiator: credential.address,
        listing_id: listing.id,
        price: bidPrice || listing.price,
        request_id: 0,
        user: credential
      }

      setPurchaseRequests([...purchaseRequests, new_purchase_request_construct])
      toast.success("Purchase Request created")


    } catch (error: any) {
      console.log(error);
      setCreatingPurchaseAgreement(false)
      toast.error(error.message || "Something went wrong");
    }
  }


  const [showDialog, setShowDialog] = useState(false);


  if (loading)
    return (
      <div className="flex flex-col gap-4 py-4">
        <Skeleton className="aspect-video bg-background" />
        <Separator className="my-2 h-px w-full" />
        <Skeleton className="aspect-video bg-background" />
      </div>
    );

  const event: CalendarEvent = {
    title: "COiTON Inspection times",
    description: "Inspection and property viewing are still happening",
    start: "2025-12-3 13:00:00 +0100",
    end: "2025-12-3 13:40:00 +0100",
    duration: [40, "minutes"],
  };

      const googleUrl = google(event);
      const outlookUrl = outlook(event);
      const office365Url = office365(event);
      const yahooUrl = yahoo(event);
      const icsUrl = ics(event);

  const calendarLinks = [
    {
      label: "Google Calendar",
      url: googleUrl,
      icon: SiGooglecalendar,
    },
    {
      label: "Apple (ICS)",
      url: icsUrl,
      icon: ImAppleinc,
    },
    {
      label: "Office365",
      url: office365Url,
      icon: CgMicrosoft,
    },
    {
      label: "Outlook",
      url: outlookUrl,
      icon: PiMicrosoftOutlookLogo,
    },
    {
      label: "Yahoo",
      url: yahooUrl,
      icon: FaYahoo,
    },
  ]


  return (
    <div className="flex flex-col gap-4 py-4">
      <Helmet>
        <title>{listing?.details?.title || "Loading..."}</title>
        <meta name="description" content={listing?.details?.description || "Loading..."} />
        <meta name="keywords" content={`${listing?.details?.title?.split(" ").join(", ")}, real estate, listing, property`} />


        <meta property="og:type" content="website" />
        <meta property="og:url" content={content.url} />


        <meta property="og:title" content={listing?.details?.title || "Loading..."} />
        <meta property="og:description" content={listing?.details?.description || "Loading..."} />
        <meta property="og:image" content={listing ? `${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}` : ""} />



      </Helmet>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Property</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <Modal loading={creatingPurchaseAgreement} onSubmit={createPurchaseAgreement} purchaseRequests={purchaseRequests} details={details} onClose={() => setShowDialog(false)} isOpen={showDialog}

        listing={listing ?? undefined}
      />
      <div className="flex flex-1 flex-col gap-5 rounded-md sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between md:flex-col lg:flex-row lg:gap-[54px]">
          <div className="flex flex-col gap-4">
            <p className="flex flex-col gap-2">
              <span className="text-base font-medium leading-none">
                {listing?.details?.title}
              </span>
              <span className="text-xl font-medium text-primary">
                Price ${listing?.price.toLocaleString()}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 17.5H2"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 21V16C22 14.1144 22 13.1716 21.4142 12.5858C20.8284 12 19.8856 12 18 12H6C4.11438 12 3.17157 12 2.58579 12.5858C2 13.1716 2 14.1144 2 16V21"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 12V10.6178C16 10.1103 15.9085 9.94054 15.4396 9.7405C14.4631 9.32389 13.2778 9 12 9C10.7222 9 9.53688 9.32389 8.5604 9.7405C8.09154 9.94054 8 10.1103 8 10.6178V12"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 12V7.36057C20 6.66893 20 6.32311 19.8292 5.99653C19.6584 5.66995 19.4151 5.50091 18.9284 5.16283C16.9661 3.79978 14.5772 3 12 3C9.42282 3 7.03391 3.79978 5.07163 5.16283C4.58492 5.50091 4.34157 5.66995 4.17079 5.99653C4 6.32311 4 6.66893 4 7.36057V12"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="text-sm font-normal leading-none text-[#8B8B8B]">
                  {listing?.details?.bedrooms} Bedroom
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 20L5 21M18 20L19 21"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 12V13C3 16.2998 3 17.9497 4.02513 18.9749C5.05025 20 6.70017 20 10 20H14C17.2998 20 18.9497 20 19.9749 18.9749C21 17.9497 21 16.2998 21 13V12"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12H22"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 12V5.5234C4 4.12977 5.12977 3 6.5234 3C7.64166 3 8.62654 3.73598 8.94339 4.80841L9 5"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 6L10.5 4"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="text-sm font-normal leading-none text-[#8B8B8B]">
                  {listing?.details?.bathrooms} Baths
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 21V9.61065C22 8.28771 22 7.62624 21.6561 7.11395C21.3123 6.60167 20.7034 6.35601 19.4856 5.86468L13.4856 3.44396C12.752 3.14799 12.3852 3 12 3C11.6148 3 11.248 3.14799 10.5144 3.44396L4.51444 5.86468C3.29663 6.35601 2.68773 6.60167 2.34387 7.11395C2 7.62624 2 8.28771 2 9.61065V21"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 19V21M8 19V21"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 14L7.74254 13.0299C8.10632 11.5747 8.28821 10.8472 8.83073 10.4236C9.37325 10 10.1232 10 11.6231 10H12.3769C13.8768 10 14.6267 10 15.1693 10.4236C15.7118 10.8472 15.8937 11.5747 16.2575 13.0299L16.5 14"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 14H7C6.44772 14 6 14.4477 6 15V18C6 18.5523 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18V15C18 14.4477 17.5523 14 17 14Z"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 16.4902V16.5002"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5 16.4902V16.5002"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="text-sm font-normal leading-none text-[#8B8B8B]">
                  2 Car park
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C7.46544 12 3.62948 14.9642 2.35747 19.044C1.99646 20.2019 1.81595 20.7809 2.26968 21.3904C2.7234 22 3.46112 22 4.93655 22H19.0634C20.5389 22 21.2766 22 21.7303 21.3904C22.184 20.7809 22.0035 20.2019 21.6425 19.044C20.3705 14.9642 16.5346 12 12 12Z"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 17H15.009"
                    stroke="#949494"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C12 20.3431 10.6569 19 9 19C7.34315 19 6 20.3431 6 22"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 12V7.5M12 7.5V5C12 3.58579 12 2.87868 12.4393 2.43934C12.8787 2 13.5858 2 15 2H17.25C18.4228 2 19.0092 2 19.4131 2.30997C19.5171 2.38977 19.6102 2.48286 19.69 2.58686C20 2.99082 20 3.57721 20 4.75C20 5.92279 20 6.50918 19.69 6.91314C19.6102 7.01714 19.5171 7.11023 19.4131 7.19003C19.0092 7.5 18.4228 7.5 17.25 7.5H12Z"
                    stroke="#949494"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="text-sm font-normal leading-none text-[#8B8B8B]">
                  {Number(listing?.details.propertySize).toLocaleString()} km/sq
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowDialog(true)}>
              <BiLeaf className="size-5" />
              <span>Purchase/Rent</span>
            </Button>
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <button className="w-12 h-12 flex items-center rounded-full justify-center border-2 border-black/30">
                  <Share2 size={20} className="text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                sideOffset={0}
                className="mr-5 md:mr-6"
              >
                <div className="flex items-center justify-center gap-5 p-4">
                  <TwitterShareButton
                    htmlTitle="X"
                    title={content.message}
                    url={content.url}
                    children={<XIcon round size={30} />}
                  />
                  <FacebookShareButton
                    htmlTitle="Facebook"
                    url={content.url}
                    title={content.message}
                    children={<FacebookIcon round size={30} />}
                  />
                  <LinkedinShareButton
                    htmlTitle="Linkedin"
                    title={content.message}
                    url={content.url}
                    children={<LinkedinIcon round size={30} />}
                  />

                  <TelegramShareButton
                    htmlTitle="Telegram"
                    url={content.url}
                    title={content.message}
                    children={<TelegramIcon round size={30} />}
                  />
                  <WhatsappShareButton htmlTitle="Whatsapp" url={content.url} title={content.message} children={<WhatsappIcon round size={30} />} />
                  <button title="Copy Link" onClick={async () => {
                    await navigator.clipboard.writeText(content.url);
                    toast.success("Link copied")
                  }}>
                    <LinkIcon size={20} />
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex w-full flex-col gap-10 xl:flex-row xl:items-start">
          <div className="flex w-full flex-col gap-6 xl:sticky xl:top-24">
            <div className="aspect-[1.4] w-full overflow-hidden rounded-2xl border bg-secondary lg:aspect-[1.3]">
              <img
                src={`${import.meta.env.VITE_PINATA_GATEWAY}/${selectedImage || listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                alt={`${listing?.details?.title}`}
                className="size-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listing?.details?.imagesCid?.filter((ft: string) => !listing?.details?.floorPlanCid?.includes(ft))?.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={cn(
                    "relative flex-shrink-0 overflow-hidden rounded-md transition-all hover:opacity-90",
                    (selectedImage || listing?.details?.imagesCid[0]) === image
                      ? "ring-2 ring-primary"
                      : "opacity-50",
                  )}
                >
                  <img
                    src={`${import.meta.env.VITE_PINATA_GATEWAY}/${image}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}

                    alt={listing?.details?.title}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-12 lg:max-w-[685px]">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-primary">Description</p>
              <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-base md:text-base">
                <span
                  className={cn("md:font-normal", {
                    "line-clamp-4": !showMore,
                  })}
                >
                  {listing?.details?.description}
                </span>
                <span
                  role="button"
                  onClick={() => setShowMore(!showMore)}
                  className="w-max font-medium text-primary"
                >
                  {showMore ? "View Less" : "View More"}
                </span>
              </pre>
            </div>

            <div className="flex flex-col gap-2">
              <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
                Address
              </p>

              <div className="grid grid-cols-2 gap-12">
                {addresses.map((addr: any, index: number) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-base font-medium text-muted-foreground">
                      {addr.label}
                    </span>
                    <span className="text-lg font-medium">{addr?.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
                Details
              </p>

              <div className="grid grid-cols-2 gap-12">
                {details.map((dtls: any) => (
                  <div key={dtls.label} className="flex flex-col">
                    <span className="text-base font-medium text-muted-foreground">
                      {dtls.label}
                    </span>
                    <span className="text-lg font-medium">{dtls.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="flex flex-wrap items-center justify-between gap-10 sm:gap-6">
              <div className="flex flex-col gap-1">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 5.7207C18.3284 5.7207 19 6.39227 19 7.2207C19 8.04913 18.3284 8.7207 17.5 8.7207C16.6716 8.7207 16 8.04913 16 7.2207C16 6.39227 16.6716 5.7207 17.5 5.7207Z"
                    stroke="#141B34"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.77423 11.8646C1.77108 12.985 1.7495 14.6753 2.67016 15.8644C4.49711 18.224 6.49674 20.2236 8.85633 22.0505C10.0454 22.9712 11.7357 22.9496 12.8561 21.9465C15.8979 19.2229 18.6835 16.3766 21.3719 13.2486C21.6377 12.9394 21.8039 12.5604 21.8412 12.1543C22.0062 10.3587 22.3452 5.18537 20.9403 3.78044C19.5353 2.37551 14.362 2.71447 12.5664 2.87946C12.1603 2.91678 11.7813 3.08303 11.472 3.34881C8.34412 6.03716 5.49781 8.82281 2.77423 11.8646Z"
                    stroke="#141B34"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M13.7884 13.0872C13.8097 12.6862 13.9222 11.9526 13.3125 11.3951M13.3125 11.3951C13.1238 11.2226 12.866 11.0669 12.5149 10.9431C11.2583 10.5003 9.71484 11.9826 10.8067 13.3395C11.3936 14.0688 11.8461 14.2932 11.8035 15.1214C11.7735 15.7041 11.2012 16.3128 10.4469 16.5447C9.7916 16.7461 9.06876 16.4794 8.61156 15.9685C8.05332 15.3448 8.1097 14.7567 8.10492 14.5004M13.3125 11.3951L14.0006 10.707M8.66131 16.0463L8.00781 16.6998"
                    stroke="#141B34"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-lg font-medium">Potential Value</p>
                <div className="rounded-sm bg-[#DEEDEC] px-3 py-1 text-sm font-medium tracking-wide text-primary">
                  High Confidence
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-muted-foreground">
                  Low Range
                </span>
                <span className="text-lg font-medium">$410,000</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-muted-foreground">
                  Mid Range
                </span>
                <span className="text-lg font-medium">$410,000</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-muted-foreground">
                  High Range
                </span>
                <span className="text-lg font-medium">$410,000</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />
      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="">
          <div className="grid xl:grid-cols-2 grid-cols-1">
            <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
              Bidding Info
            </p>
          </div>
          <div className="grid xl:grid-cols-2 grid-cols-1 lg:gap-0 gap-5 items-start">
            <div className="lg:max-h-[65vh] max-h-[50vh] overflow-y-auto">
              <table className="w-full text-left mt-4">
                <thead>
                  <tr>
                    <th className="pb-2 text-[#C1C1C1]">Username</th>
                    <th className="pb-2 text-[#C1C1C1]">Position</th>
                    <th className="pb-2 text-[#C1C1C1]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseRequests.sort((a, b) => b.price - a.price).map((request, index) => {
                    return <tr key={index}>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#C0D9BF] w-10 h-10 rounded-full flex items-center justify-center">

                            <img src={generateAvatarFromAddress(`0x${request.initiator}`)} className="w-7 h-7" alt="" />
                          </div>
                          <p className="text-[#475467] text-sm">{truncateAddr(`0x${request.initiator}`)}</p>
                        </div>
                      </td>
                      <td className="py-2 text-sm">{String(index + 1).padStart(2, '0')}</td>
                      <td className="py-2 text-sm">${request.price.toLocaleString()}</td>
                    </tr>
                  })}


                </tbody>
              </table>
              {purchaseRequests.length === 0 ? <p className="text-muted-foreground mt-5 text-center text-sm">No biddings yet</p> : null}
            </div>

            <div className="space-y-7">
              <img src={BID_LG} alt="" />

            </div>
          </div>
        </div>
      </div>
      <Separator className="my-2 h-px w-full" />


      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-20 lg:p-10">
          <div className="flex flex-col gap-6">
            <p className="text-lg text-muted-foreground">Interior Details</p>

            <ul className="flex flex-col gap-2 pl-4">
              {listing?.details?.interior?.map((int: any, key: number) => (
                <li key={key} className="list-disc text-base font-medium">
                  {int.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg text-muted-foreground">Outdoor Details</p>

            <ul className="flex flex-col gap-2 pl-4">
              {listing?.details?.exterior?.map((ext: any, key: number) => (
                <li key={key} className="list-disc text-base font-medium">
                  {ext.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg text-muted-foreground">Utilities</p>

            <ul className="flex flex-col gap-2 pl-4">
              {listing?.details?.utilities?.map((utils: any, key: number) => (
                <li key={key} className="list-disc text-base font-medium">
                  {utils.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="flex w-full flex-col gap-10 xl:flex-row">
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-base text-muted-foreground">FLOOR PLANS</p>

            <p className="text-base">
              Living Spaces are more easily interpreted. All-In-Ones color floor
              plan option clearly defines your listing’s living spaces, making
              them obvious and clearly visible to your potential buyers/clients.
              Add extra value to your services. Color floor-plans show that you
              care about selling your client’s listing; they add a premium, high
              value look to any listing and can be used in your brochures, email
              and websites.
            </p>
          </div>

          <Carousel opts={{ active: true, loop: true, duration: 1 }} className="relative aspect-[1.5] flex-1 rounded-xl bg-secondary">
            <CarouselContent>
              {listing?.details?.floorPlanCid?.map((floorPlanCid: any, index: number) => (
                <CarouselItem key={index} className="aspect-[1.5]">
                  <div className="size-full overflow-hidden rounded-md border bg-secondary md:rounded-xl">
                    <img
                      // src={floorPlanCid}
                      src={`${import.meta.env.VITE_PINATA_GATEWAY}/${floorPlanCid}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}

                      alt="floor plan"
                      className="size-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-6" />
            <CarouselNext className="right-6" />
          </Carousel>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      {
        listing?.details?.videosCid?.length && (
          <div className="flex aspect-video flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] 2xl:flex-row">
            <video controls muted autoPlay loop className="aspect-video w-full rounded-lg">
                <source src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details.videosCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`} />
            </video>
          </div>
        )
      }

      <Separator className="my-2 h-px w-full" />

      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="flex w-full flex-col gap-6 sm:max-w-full xl:max-w-full xl:flex-row 2xl:max-w-lg 2xl:flex-col">
          <div className="space-y-2">
            <div className="flex flex-1 flex-col gap-7 rounded-md border p-6 sm:rounded-xl sm:p-8">
              <div className="flex flex-col gap-3">
                <p className="text-xl font-medium">Agent details</p>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="font-medium capitalize">{listing?.owner_details?.details.name}</p>
                    {listing?.owner_details?.user_type === "Entity" ? listing?.owner_details.verified ? <Verified size={19} color="#166534" /> : <div className="border border-red-500 rounded-full py-0.5 px-3 text-sm text-red-500 font-bold">Not verified</div> : null}
                  </div>
                  <p className="text-muted-foreground">
                    {listing?.owner_details?.details?.email}
                  </p>
                </div>
              </div>

              <Button onClick={() => {
                navigate(`/profile/0x${listing?.owner}`, { state: listing?.owner_details })
              }} size={"lg"} className="rounded-full">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.89453 11.654C4.89453 7.56846 4.89453 5.52572 6.16373 4.25651C7.43294 2.9873 9.47569 2.9873 13.5612 2.9873H15.1862C19.2717 2.9873 21.3145 2.9873 22.5836 4.25651C23.8529 5.52572 23.8529 7.56846 23.8529 11.654V15.9873C23.8529 20.0728 23.8529 22.1156 22.5836 23.3847C21.3145 24.654 19.2717 24.654 15.1862 24.654H13.5612C9.47569 24.654 7.43294 24.654 6.16373 23.3847C4.89453 22.1156 4.89453 20.0728 4.89453 15.9873V11.654Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.1771 13.7923C10.715 12.9864 10.4918 12.3283 10.3573 11.6612C10.1583 10.6748 10.6137 9.71108 11.3681 9.09618C11.687 8.8363 12.0525 8.92509 12.241 9.26336L12.6667 10.027C13.0041 10.6323 13.1728 10.935 13.1393 11.2559C13.1059 11.5767 12.8784 11.838 12.4234 12.3607L11.1771 13.7923ZM11.1771 13.7923C12.1126 15.4233 13.5806 16.8922 15.2136 17.8288M15.2136 17.8288C16.0195 18.2909 16.6775 18.5141 17.3446 18.6486C18.3311 18.8476 19.2947 18.3922 19.9096 17.6378C20.1695 17.3188 20.0808 16.9533 19.7425 16.7648L18.9788 16.3392C18.3735 16.0017 18.0709 15.833 17.75 15.8665C17.4291 15.9 17.1678 16.1275 16.6451 16.5825L15.2136 17.8288Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.97786 7.32031H3.26953M5.97786 13.8203H3.26953M5.97786 20.3203H3.26953"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span>View Agent</span>
              </Button>
            </div>
            <div className="flex flex-1 flex-col gap-16 rounded-md border p-6 sm:rounded-xl sm:p-8">
              <div className="flex flex-col gap-7">
                <p className="text-xl font-medium">Inspection times</p>

                <div className="flex flex-col">
                  <p className="text-muted-foreground">
                    Inspection and property viewing are still happening
                  </p>
                  <p className="text-lg font-medium text-primary sm:text-2xl">
                    Wednesday 3 Dec, 1:00pm - 1:40pm
                  </p>
                </div>
              </div>

              <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button size={"lg"} className="rounded-full">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.89453 11.654C4.89453 7.56846 4.89453 5.52572 6.16373 4.25651C7.43294 2.9873 9.47569 2.9873 13.5612 2.9873H15.1862C19.2717 2.9873 21.3145 2.9873 22.5836 4.25651C23.8529 5.52572 23.8529 7.56846 23.8529 11.654V15.9873C23.8529 20.0728 23.8529 22.1156 22.5836 23.3847C21.3145 24.654 19.2717 24.654 15.1862 24.654H13.5612C9.47569 24.654 7.43294 24.654 6.16373 23.3847C4.89453 22.1156 4.89453 20.0728 4.89453 15.9873V11.654Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.1771 13.7923C10.715 12.9864 10.4918 12.3283 10.3573 11.6612C10.1583 10.6748 10.6137 9.71108 11.3681 9.09618C11.687 8.8363 12.0525 8.92509 12.241 9.26336L12.6667 10.027C13.0041 10.6323 13.1728 10.935 13.1393 11.2559C13.1059 11.5767 12.8784 11.838 12.4234 12.3607L11.1771 13.7923ZM11.1771 13.7923C12.1126 15.4233 13.5806 16.8922 15.2136 17.8288M15.2136 17.8288C16.0195 18.2909 16.6775 18.5141 17.3446 18.6486C18.3311 18.8476 19.2947 18.3922 19.9096 17.6378C20.1695 17.3188 20.0808 16.9533 19.7425 16.7648L18.9788 16.3392C18.3735 16.0017 18.0709 15.833 17.75 15.8665C17.4291 15.9 17.1678 16.1275 16.6451 16.5825L15.2136 17.8288Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.97786 7.32031H3.26953M5.97786 13.8203H3.26953M5.97786 20.3203H3.26953"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span>Add to calender</span>
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                sideOffset={0}
                className="w-[280px]"
                >
                  {calendarLinks.map((link) => (
                    <Link to={link.url} target="_blank">
                      <DropdownMenuItem className="gap-3">
                        <link.icon className="!size-5" />
                        <span>{link.label}</span>
                      </DropdownMenuItem>
                  </Link>
                  ))}

              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>

          <div dangerouslySetInnerHTML={{ __html: listing?.details?.map }} className="-z-0 aspect-[1.4] flex-1 w-full overflow-hidden rounded-xl border bg-secondary sm:rounded-2xl 2xl:aspect-auto">
            {/* <MapView
            location={listingFormData?.region?.country?.countryName}
            center={[
              listingFormData?.region?.country?.countryLat,
              listingFormData?.region?.country?.countryLong,
            ]}
          /> */}
          </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {listing?.details?.licenseCid.map((_: any, _index: number) => (
            <div
              key={_index}
              className="flex items-center gap-4 rounded-2xl bg-secondary p-4"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-background">
                <PiFolderOpenDuotone className="size-8" />
              </div>

              <div className="flex flex-1 flex-col">
                <p className="text-base font-medium md:text-lg">
                  Property License
                  {/* {license?.path?.replace("./", "").substring(0, 15)} */}
                </p>
                {/* <p className="text-sm text-muted-foreground">
                  PDF - {license?.size}MB
                </p> */}
              </div>

              <div className="ml-auto mr-2">
                <Link target="_blank"
                  to={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details.licenseCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}

                >
                  <RxOpenInNewWindow className="size-6" role="button" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}





interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: Listing;
  details: any[];
  purchaseRequests: PurchaseRequest[];
  onSubmit: (bidPrice?: number) => void;
  loading?: boolean
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, listing, details, purchaseRequests, onSubmit, loading }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  const bidInputRef = useRef<HTMLInputElement>(null);


  const submit = () => {
    if (!bidInputRef.current) {
      toast.error("INVALID_BID");
      return;
    }
    const value = (bidInputRef.current.value)
    if (value.trim().length > 0) {
      if (isNaN(Number(value))) {
        toast.error("INVALID_BID");
        return;
      }

      if (Number(value) < (listing?.price ?? 0)) {
        toast.error("BID_TOO_LOW");
        return;
      }
      onSubmit(Number(value.trim()));
      return;
    }
    onSubmit();
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-lg lg:p-6 p-3 w-full lg:max-w-[70vw] max-w-screen-sm transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-satoshi font-semibold">Agreement Info</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>
        <div>  <div className="flex w-full flex-col gap-10 xl:flex-row xl:items-start">
          <div className="flex w-full flex-col gap-6">
            <div className="w-full overflow-hidden rounded-2xl border bg-secondary">
              <img
                src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                alt={`Product image`}
                className=" object-cover lg:h-[30rem] h-72 w-full"
              />
            </div>


          </div>

          <div className="flex w-full flex-col gap-12 lg:max-w-[685px]">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-primary">Snapshot</p>
              <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-base md:text-base">
                <span
                  className={"line-clamp-4 md:font-normal"}
                >
                  {listing?.details?.description}
                </span>

              </pre>
            </div>



            <div className="flex flex-col gap-2">
              <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
                Building Info
              </p>

              <div className="grid grid-cols-2 gap-2">
                {details.map((dtls: any) => (
                  <div key={dtls.label} className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      {dtls.label}
                    </span>
                    <span className="text font-medium">{dtls.value}</span>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>

          <div className="mt-20">
            <div className="grid lg:grid-cols-2 grid-cols-1">
              <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
                Bidding Info
              </p>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-0 gap-5 items-start">
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="w-full text-left mt-4">
                  <thead>
                    <tr>
                      <th className="pb-2 text-[#C1C1C1]">Username</th>
                      <th className="pb-2 text-[#C1C1C1]">Position</th>
                      <th className="pb-2 text-[#C1C1C1]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseRequests.sort((a, b) => b.price - a.price).map((request, index) => {
                      return <tr key={index}>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#C0D9BF] w-10 h-10 rounded-full flex items-center justify-center">

                              <img src={generateAvatarFromAddress(`0x${request.initiator}`)} className="w-7 h-7" alt="" />
                            </div>
                            <p className="text-[#475467] text-sm">{truncateAddr(`0x${request.initiator}`)}</p>
                          </div>
                        </td>
                        <td className="py-2 text-sm">{String(index + 1).padStart(2, '0')}</td>
                        <td className="py-2 text-sm">${request.price.toLocaleString()}</td>
                      </tr>
                    })}




                  </tbody>
                </table>
                {purchaseRequests.length === 0 ? <p className="text-muted-foreground mt-5 text-center text-sm">No biddings yet</p> : null}
              </div>

              <div className="space-y-7">
                <img src={BID} alt="" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Current Bid Price
                  </span>
                  {purchaseRequests.length > 0 ? <span className="font-medium">${purchaseRequests.sort((a, b) => b.price - a.price)[0].price.toLocaleString()}</span> : null}
                </div>

                <div className="">
                  <label htmlFor="bid" className="text-sm text-muted-foreground">Input Your Bid Price</label>
                  <Input ref={bidInputRef} type="number" id="bid" className="mt-1 text-sm" placeholder={`$${purchaseRequests.length > 0 ? purchaseRequests.sort((a, b) => b.price - a.price)[0].price.toLocaleString() : listing?.price.toLocaleString()}`} />
                </div>

                <div className="flex items-center justify-end">
                  <Button disabled={loading} onClick={submit}>
                    {loading ? (
                      <>
                        <Loader className="size-5 animate-spin" />
                        <span className="">Please wait</span>
                      </>
                    ) : (
                      <>
                        <BiLeaf className="size-5" />
                        <span>Initiate Agreement</span>
                      </>
                    )}

                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
