import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
  PiBathtub,
  PiFolderOpenDuotone,
  PiIslandDuotone,
} from "react-icons/pi";
import { RxOpenInNewWindow } from "react-icons/rx";

import { byteArrayToString, toHex } from "@/lib/starknet/utils";
import { useEffect, useRef, useState } from "react";
import { parseUnits } from "ethers";
import {
  cn,
  formatDate,
  generateAvatarFromAddress,
  truncateAddr,
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { Link as LinkIcon, Loader, Share2, X } from "lucide-react";
import { BiLeaf } from "react-icons/bi";
import { toast } from "sonner";
import { Listing, PurchaseRequest } from "@/store/slice/listing.slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/store/slice/credential.slice";
import { useWalletHook } from "@/hooks/useWallet.hook";
import { useAppSelector } from "@/store";
import BID from "../../../assets/images/bid.png";
import BID_LG from "../../../assets/images/bid_lg.png";
import { Input } from "@/components/ui/input";
import { CairoOption, CairoOptionVariant, Call } from "starknet";
import { variables } from "@/utils/variables";
import { RiBuilding2Line, RiUser6Line } from "react-icons/ri";
import { contract } from "@/utils/contract";
import InspectionCard from "./_components/inspection-card";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { MdVerified } from "react-icons/md";
import { IoBedOutline } from "react-icons/io5";
import { TbResize } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";

const customIcon = new Icon({
  iconUrl: "/marker.svg",
  iconSize: [35, 51],
  iconAnchor: [12, 41],
});

export default function PropertyDetailsPage() {
  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [property, setProperty] = useState<any>(null)

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [addresses, setAddresses] = useState<
    { label: string; value: string }[]
  >([]);
  const [details, setDetails] = useState<{ label: string; value: string }[]>(
    [],
  );
  const { getContractInstance, getErc20Instance } = useContractInstance();

  const [content, setContent] = useState({
    url: window.location.href,
    message: "",
  });

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
        label: "Country",
        value:
          _listing?.details?.region?.country?.countryName ??
          _listing?.details?.region?.[0],
      },
      {
        label: "State",
        value:
          _listing?.details?.region?.state?.stateName ??
          _listing?.details?.region?.[1],
      },
      {
        label: "City",
        value:
          _listing?.details?.region?.city?.cityName ??
          _listing?.details?.region?.[2] ??
          "N/A",
      },
      {
        label: "ZIP",
        value: _listing?.details?.zip,
      },
    ]);
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
    ]);
  }

  async function fetchListings() {
    try {
      const contract = getContractInstance();
      setLoading(true);
      if (!contract) return;
      const listing = await contract.get_listing(id);
      const user = listing.owner_details.Some;
      const user_construct: User = {
        ...user,
        address: toHex(user.address),
        id: Number(user.id),
        details: byteArrayToString(user.details),
        user_type: user.user_type.variant.Entity ? "Entity" : "Individual",
      };

      const structured: Listing = {
        id: Number(listing.id),
        owner: toHex(listing.owner),
        price: Number(listing.price),
        tag: listing.tag.variant.Sold ? "Sold" : "ForSale",
        details: byteArrayToString(listing.details),
        owner_details: user_construct,
      };

      setListing(structured);
      configureVars(structured);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("LISTING_NOT_FOUND");
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    if (location.state) {
      setListing(location.state);

      configureVars(location.state);
    } else {
      fetchListings();
    }
  }, []);

  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(
    [],
  );
  const [loadingPurchaseRequests, setLoadingPurchaseRequests] = useState(false);

  const fetchPurchaseRequests = async () => {
    if (loadingPurchaseRequests) return;
    try {
      setLoadingPurchaseRequests(true);
      const contract = getContractInstance();
      const purchase_requests =
        await contract.get_listing_purchase_requests(id);

      const structured = purchase_requests.map((request: any) => {
        const user = request.user.Some;

        const user_construct: User = {
          ...user,
          address: toHex(user.address),
          id: Number(user.id),
          details: byteArrayToString(user.details),
          user_type: user.user_type.variant.Entity ? "Entity" : "Individual",
        };

        const request_construct: PurchaseRequest = {
          initiator: toHex(request.initiator),
          listing_id: Number(request.listing_id),
          price: Number(request.price),
          request_id: Number(request.id),
          user: user_construct,
        };
        return request_construct;
      });

      setPurchaseRequests(structured);
      setLoadingPurchaseRequests(false);
    } catch (error) {
      console.log(error);
      setLoadingPurchaseRequests(false);
    }
  };

  useEffect(() => {
    fetchPurchaseRequests();
  }, [id]);

  useEffect(() => {
    setContent({ ...content, message: listing?.details?.title });
  }, [listing]);

  const { hasRegistered } = useAppSelector((state) => state.wallet);
  const { credential } = useAppSelector((state) => state.credential);
  const { walletAddress } = useAppSelector((state) => state.wallet);

  const [creatingPurchaseAgreement, setCreatingPurchaseAgreement] =
    useState<boolean>(false);
  const { handleConnectWallet, argentWebWallet } = useWalletHook();

  const handleConnect = async ({
    callbackData,
    approval = parseUnits("100").toString(),
  }: {
    callbackData?: string;
    approval?: string;
  }) => {
    console.log(approval.toString());
    const response = await argentWebWallet.requestConnection({
      callbackData: callbackData,
      approvalRequests: [
        {
          tokenAddress: contract.erc20Address as any,
          amount: approval.toString(),
          // Your dapp contract
          spender: contract.daoAddress as any,
        },
      ],
    });
    console.log(response);

    if (response) {
      window.Wallet = {
        Account: response.account,
        IsConnected: true,
      };
      // Dispatch a custom event to notify about the change
      const event = new Event("windowWalletClassChange");
      window.dispatchEvent(event);
      return response.callbackData;
    }
  };

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
      if (
        purchaseRequests.length > 0 &&
        purchaseRequests.filter(
          (ft) =>
            parseInt(ft.initiator, 16) === parseInt(credential.address, 16),
        ).length > 0
      ) {
        toast.error("ALREADY_CREATED");
        return;
      }
      if (!listing?.owner_details?.verified) {
        toast.error("AGENT_NOT_VERIFIED!");
        return;
      }
      setCreatingPurchaseAgreement(true);

      const erc20 = getErc20Instance();
      const allowance = await erc20!.allowance(
        walletAddress as string,
        contract.daoAddress,
      );
      const account = window.Wallet.Account!;

      console.log(allowance);

      if ((bidPrice || listing.price) > Number(allowance)) {
        await handleConnect({
          approval: (bidPrice || listing.price).toString(),
        });
      }

      const contractInstance = getContractInstance();

      const calls: Call = contractInstance!.populate(
        "create_purchase_request",
        [
          listing.id,
          new CairoOption(CairoOptionVariant.Some, bidPrice || listing.price),
        ],
      );

      if (!account) throw new Error("Wallet not connected!");

      try {
        const callPayload = await account?.getOutsideExecutionPayload({
          calls: [calls],
        });

        console.log(callPayload);

        console.log("CALLING ENDPOINT");
        const response = await fetch(
          `${variables.renderEndpoint}/contract/execute`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(callPayload),
            redirect: "follow",
          },
        );

        console.log("ENDPOINT CALLED");

        const result = await response.json();

        if (!result?.success) {
          toast.error(result?.message);
          throw new Error(result?.message);
        }

        return result;
      } catch (error: any) {
        console.error("EXECUTE FN ERROR: ", error);
      }

      setCreatingPurchaseAgreement(false);
      // const new_purchase_request_construct: PurchaseRequest = {
      //   initiator: credential.address,
      //   listing_id: listing.id,
      //   price: bidPrice || listing.price,
      //   request_id: 0,
      //   user: credential,
      // };

      // setPurchaseRequests([
      //   ...purchaseRequests,
      //   new_purchase_request_construct,
      // ]);
      // toast.success("Purchase Request created");
    } catch (error: any) {
      console.log(error);
      setCreatingPurchaseAgreement(false);
      toast.error(error.message || "Something went wrong");
    } finally {
      setCreatingPurchaseAgreement(false);
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

  const isOwner =
    (credential?.address ?? "").toLowerCase() ===
    (listing?.owner ?? "").toLowerCase();

  console.log(listing);

  return (
    <div className="flex flex-col gap-4 py-4">
      <Helmet>
        <title>{listing?.details?.title || "Loading..."}</title>
        <meta
          name="description"
          content={listing?.details?.description || "Loading..."}
        />
        <meta
          name="keywords"
          content={`${listing?.details?.title?.split(" ").join(", ")}, real estate, listing, property`}
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={content.url} />

        <meta
          property="og:title"
          content={listing?.details?.title || "Loading..."}
        />
        <meta
          property="og:description"
          content={listing?.details?.description || "Loading..."}
        />
        <meta
          property="og:image"
          content={
            listing
              ? `${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`
              : ""
          }
        />
      </Helmet>

      <Modal
        loading={creatingPurchaseAgreement}
        onSubmit={createPurchaseAgreement}
        purchaseRequests={purchaseRequests}
        details={details}
        onClose={() => setShowDialog(false)}
        isOpen={showDialog}
        listing={listing ?? undefined}
      />
      <div className="flex flex-1 flex-col gap-10 rounded-md sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between md:flex-col lg:flex-row lg:gap-[54px]">
          <div className="flex flex-col gap-4">
            <p className="flex flex-col gap-2">
              <span className="text-base font-normal">
                {listing?.details?.title}
              </span>
              <span className="text-lg font-semibold text-primary sm:text-xl">
                Offer from ${listing?.price.toLocaleString()}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-0 sm:gap-y-2 sm:divide-x">
              <div className="flex items-center gap-2 text-muted-foreground sm:pr-4">
                <IoBedOutline className="size-5" />

                <span className="text-sm font-normal leading-none">
                  <strong>{listing?.details?.bedrooms}</strong> Bedroom
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground sm:px-4">
                <PiBathtub className="size-5" />

                <span className="text-sm font-normal leading-none">
                  <strong>{listing?.details?.bathrooms}</strong> Bathrooms
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground sm:px-4">
                <TbResize className="size-5" />

                <span className="text-sm font-normal leading-none">
                  <strong>
                    {Number(listing?.details.propertySize).toLocaleString()}
                  </strong>{" "}
                  Sqft
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground sm:pl-4">
                {listing?.details?.propertyType === "land" ? (
                  <PiIslandDuotone className="size-4" />
                ) : (
                  <RiBuilding2Line className="size-4" />
                )}

                <span className="text-sm font-normal capitalize leading-none">
                  {listing?.details.propertyType ?? "building"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              disabled={listing?.tag === "Sold"}
              onClick={() => setShowDialog(listing?.tag === "ForSale")}
              className="flex-1"
              title={
                listing?.tag === "ForSale"
                  ? "Property for sale"
                  : "Property has been sold"
              }
            >
              <BiLeaf className="size-5" />
              <span>Purchase/Rent</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size="icon">
                  <Share2 size={20} className="text-muted-foreground" />
                </Button>
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
                  <WhatsappShareButton
                    htmlTitle="Whatsapp"
                    url={content.url}
                    title={content.message}
                    children={<WhatsappIcon round size={30} />}
                  />
                  <button
                    title="Copy Link"
                    onClick={async () => {
                      await navigator.clipboard.writeText(content.url);
                      toast.success("Link copied");
                    }}
                  >
                    <LinkIcon size={20} />
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex w-full flex-col gap-10 xl:flex-row xl:items-start">
          <div className="flex w-full gap-1 xl:sticky xl:top-24">
            <ScrollArea className="flex h-[326px] w-[80px] flex-col gap-5 pr-3 sm:h-[426px] sm:w-[120px]">
              {listing?.details?.imagesCid
                ?.filter(
                  (ft: string) => !listing?.details?.floorPlanCid?.includes(ft),
                )
                ?.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      "relative aspect-[1.2] w-full shrink-0 overflow-hidden rounded-md border-2 border-background transition-all hover:opacity-90 sm:rounded-lg",
                      (selectedImage || listing?.details?.imagesCid[0]) ===
                        image
                        ? "border-primary"
                        : "opacity-50",
                    )}
                  >
                    <img
                      src={`${import.meta.env.VITE_PINATA_GATEWAY}/${image}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                      alt={listing?.details?.title}
                      className="size-full object-cover"
                    />
                  </button>
                ))}
            </ScrollArea>
            <div className="aspect-[1.2] w-full overflow-hidden rounded-2xl border bg-secondary">
              <img
                src={`${import.meta.env.VITE_PINATA_GATEWAY}/${selectedImage || listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                alt={`${listing?.details?.title}`}
                className="size-full object-cover"
              />
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
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      {/* Bidding info*/}
      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="">
          <div className="grid grid-cols-1 xl:grid-cols-2">
            <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
              Bidding Info
            </p>
          </div>
          <div className="grid grid-cols-1 items-start gap-10 lg:gap-0 xl:grid-cols-2">
            <div className="max-h-[50vh] overflow-y-auto lg:max-h-[65vh]">
              <table className="mt-4 w-full text-left">
                <thead>
                  <tr>
                    <th className="pb-2 text-[#C1C1C1]">Username</th>
                    <th className="pb-2 text-[#C1C1C1]">Position</th>
                    <th className="pb-2 text-[#C1C1C1]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseRequests
                    .sort((a, b) => b.price - a.price)
                    .map((request, index) => {
                      return (
                        <tr key={index}>
                          <td className="max-w-[200px] py-2">
                            <div
                              role="button"
                              className="flex w-fit cursor-pointer items-center gap-2"
                              onClick={() => {
                                navigate(
                                  `/profile?address=${request?.initiator}`,
                                  {
                                    state: request?.user,
                                  },
                                );
                              }}
                            >
                              <div className="size-12 rounded-[12px] border p-0.5">
                                <div className="size-full rounded-[10px] border bg-[#C0D9BF]">
                                  <img
                                    src={generateAvatarFromAddress(
                                      request.initiator,
                                    )}
                                    alt={request.initiator}
                                    width={48}
                                    height={48}
                                    className="rounded-[8px] object-contain"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-medium capitalize text-foreground">
                                    {request.user?.details.name}
                                  </p>
                                  {request.user?.verified && (
                                    <MdVerified className="mt-px size-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {truncateAddr(request.initiator)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 text-sm font-medium">
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td className="py-2 text-sm font-medium">
                            ${request.price.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {listing?.tag === "Sold" ? (
                <p className="mt-5 text-center text-sm text-muted-foreground">
                  This property has been sold!
                </p>
              ) : purchaseRequests.length === 0 ? (
                <p className="mt-5 text-center text-sm text-muted-foreground">
                  No biddings yet
                </p>
              ) : null}
            </div>

            <div className="space-y-7">
              <img src={BID_LG} alt="" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      {/* INTERIOR, OUTDOOR & UTILITIES DETAILS */}
      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-20 lg:grid-cols-3 lg:p-10">
          <div className="flex flex-col gap-6">
            <p className="text-lg text-muted-foreground">Interior Details</p>

            <ul className="flex flex-col gap-2 pl-4">
              {listing?.details?.interior?.map((int: any, key: number) => (
                <li key={key} className="list-disc text-base font-medium">
                  {int.text ?? int}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg text-muted-foreground">Outdoor Details</p>

            <ul className="flex flex-col gap-2 pl-4">
              {listing?.details?.exterior?.map((ext: any, key: number) => (
                <li key={key} className="list-disc text-base font-medium">
                  {ext.text ?? ext}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg text-muted-foreground">Utilities</p>

            <ul className="flex flex-col gap-2 pl-4">
              {listing?.details?.utilities?.map((utils: any, key: number) => (
                <li key={key} className="list-disc text-base font-medium">
                  {utils.text ?? utils}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      {/* FLOOR PLANS */}
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

          <Carousel
            opts={{ active: true, loop: true, duration: 1 }}
            className="relative aspect-[1.5] flex-1 rounded-xl bg-secondary"
          >
            <CarouselContent>
              {listing?.details?.floorPlanCid?.map(
                (floorPlanCid: any, index: number) => (
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
                ),
              )}
            </CarouselContent>
            <CarouselPrevious className="left-6" />
            <CarouselNext className="right-6" />
          </Carousel>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      {/* VIDEO SNIPPET */}
      {listing?.details?.videosCid?.length && (
        <>
          <div className="flex aspect-video flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] 2xl:flex-row">
            <video
              controls
              muted
              autoPlay
              loop
              className="aspect-video w-full rounded-lg"
            >
              <source
                src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details.videosCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
              />
            </video>
          </div>
          <Separator className="my-2 h-px w-full" />
        </>
      )}

      {/* AGENT DETAILS & MAP */}
      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="flex w-full flex-col gap-6 sm:max-w-full xl:max-w-full xl:flex-row 2xl:max-w-lg 2xl:flex-col">
          <div className="space-y-2">
            <div className="flex flex-1 flex-col gap-7 rounded-md border p-6 sm:rounded-xl sm:p-8">
              <div className="flex flex-col gap-3">
                <p className="text-xl font-medium">Agent details</p>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <p className="text-base font-medium capitalize text-primary">
                      {listing?.owner_details?.details.name}
                    </p>
                    {listing?.owner_details?.verified && (
                      <MdVerified className="mt-px size-5 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                      {listing?.owner_details?.details?.email}
                    </p>
                    <p className="text-muted-foreground">
                      {listing?.owner_details?.user_type}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  navigate(`/profile?address=${listing?.owner}`, {
                    state: listing?.owner_details,
                  });
                }}
                size={"lg"}
                disabled={isOwner}
                className="rounded-full"
              >
                {isOwner ? (
                  <span>No action needed</span>
                ) : (
                  <>
                    <RiUser6Line className="!size-5" />
                    <span>View Agent's Profile</span>
                  </>
                )}
              </Button>
            </div>

            <InspectionCard
              isOwner={isOwner}
              ownerAddress={listing?.owner_details?.address as string}
              location={listing?.details?.map?.name}
            />
          </div>
        </div>

        {/* dangerouslySetInnerHTML={{ __html: listing?.details?.map }}  */}
        {(listing?.details?.map?.name &&
          listing?.details?.map?.lat &&
          listing?.details?.map?.long) ||
        listing?.details?.map?.lng ? (
          <div className="-z-0 aspect-[1.4] w-full flex-1 overflow-hidden rounded-xl border bg-secondary sm:rounded-2xl">
            <MapContainer
              center={[
                listing?.details?.map?.lat,
                listing?.details?.map?.long || listing?.details?.map?.lng,
              ]}
              zoom={6}
              className="h-full w-full"
              key={[
                listing?.details?.map?.lat,
                listing?.details?.map?.long || listing?.details?.map?.lng,
              ].join(",")}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/*
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <TileLayer
                  attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>'
                  url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
                />

                <TileLayer
                  attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>'
                  url="https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
                />

                <TileLayer
                  attribution='Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                />
                */}
              <Marker
                position={[
                  listing?.details?.map?.lat,
                  listing?.details?.map?.long || listing?.details?.map?.lng,
                ]}
                icon={customIcon}
              />
            </MapContainer>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: listing?.details?.map }}
            className="-z-0 aspect-[1.4] w-full flex-1 overflow-hidden rounded-xl border bg-secondary sm:rounded-2xl"
          ></div>
        )}
      </div>

      <Separator className="my-2 h-px w-full" />

      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:p-10 2xl:flex-row">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {listing?.details?.licenseCid &&
            listing?.details?.licenseCid.map((_: unknown, _index: number) => (
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
                  </p>
                </div>

                <div className="ml-auto mr-2">
                  <Link
                    target="_blank"
                    to={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details.licenseCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                  >
                    <RxOpenInNewWindow className="size-6" role="button" />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: Listing;
  details: any[];
  purchaseRequests: PurchaseRequest[];
  onSubmit: (bidPrice?: number) => void;
  loading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  listing,
  details,
  purchaseRequests,
  onSubmit,
  loading,
}) => {
  const navigate = useNavigate();

  // Always call hooks at the top level
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const bidInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleOutsideClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const submit = () => {
    if (!bidInputRef.current) {
      toast.error("INVALID_BID");
      return;
    }
    const value = bidInputRef.current.value;
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
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="max-h-[90vh] w-full max-w-screen-sm scale-100 transform overflow-y-auto rounded-lg bg-white p-3 shadow-lg transition-all lg:max-w-[70vw] lg:p-6">
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h2 className="font-satoshi text-xl font-semibold">Agreement Info</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>
        <div>
          <div className="flex w-full flex-col gap-10 xl:flex-row xl:items-start">
            <div className="flex w-full flex-col gap-6">
              <div className="w-full overflow-hidden rounded-2xl border bg-secondary">
                <img
                  src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                  alt={`Product image`}
                  className="h-72 w-full object-cover lg:h-[30rem]"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-12 lg:max-w-[685px]">
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold text-primary">Snapshot</p>
                <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-base md:text-base">
                  <span className={"line-clamp-4 md:font-normal"}>
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
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
                Bidding Info
              </p>
            </div>
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-0">
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="mt-4 w-full text-left">
                  <thead>
                    <tr>
                      <th className="pb-2 text-[#C1C1C1]">Username</th>
                      <th className="pb-2 text-[#C1C1C1]">Position</th>
                      <th className="pb-2 text-[#C1C1C1]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseRequests
                      .sort((a, b) => b.price - a.price)
                      .map((request, index) => {
                        return (
                          <tr key={index}>
                            <td className="py-2">
                              <div
                                role="button"
                                className="flex w-fit cursor-pointer items-center gap-2"
                                onClick={() => {
                                  navigate(
                                    `/profile?address=${request?.initiator}`,
                                    {
                                      state: request?.user,
                                    },
                                  );
                                }}
                              >
                                <div className="size-12 rounded-[12px] border p-0.5">
                                  <div className="size-full rounded-[10px] border bg-[#C0D9BF]">
                                    <img
                                      src={generateAvatarFromAddress(
                                        request.initiator,
                                      )}
                                      alt={request.initiator}
                                      width={48}
                                      height={48}
                                      className="rounded-[8px] object-contain"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-medium capitalize text-foreground">
                                      {request.user?.details.name}
                                    </p>
                                    {request.user?.verified && (
                                      <MdVerified className="mt-px size-4 text-primary" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {truncateAddr(request.initiator)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 text-sm font-medium">
                              {String(index + 1).padStart(2, "0")}
                            </td>
                            <td className="py-2 text-sm font-medium">
                              ${request.price.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {purchaseRequests.length === 0 ? (
                  <p className="mt-5 text-center text-sm text-muted-foreground">
                    No biddings yet
                  </p>
                ) : null}
              </div>

              <div className="space-y-7">
                <img src={BID} alt="" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Current Bid Price
                  </span>
                  {purchaseRequests.length > 0 ? (
                    <span className="font-medium">
                      $
                      {purchaseRequests
                        .sort((a, b) => b.price - a.price)[0]
                        .price.toLocaleString()}
                    </span>
                  ) : null}
                </div>

                <div className="">
                  <label
                    htmlFor="bid"
                    className="text-sm text-muted-foreground"
                  >
                    Input Your Bid Price
                  </label>
                  <Input
                    ref={bidInputRef}
                    type="number"
                    id="bid"
                    className="mt-1 text-sm"
                    placeholder={`$${purchaseRequests.length > 0 ? purchaseRequests.sort((a, b) => b.price - a.price)[0].price.toLocaleString() : listing?.price.toLocaleString()}`}
                  />
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
