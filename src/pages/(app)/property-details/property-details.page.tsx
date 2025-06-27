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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useEffect, useState } from "react";
import {
  cn,
  copyToClipboard,
  formatDate,
  formatUser,
  generateAvatarFromAddress,
  truncateAddr,
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { Link as LinkIcon, Share2 } from "lucide-react";
import { BiLeaf } from "react-icons/bi";
import { toast } from "sonner";
import { Listing, PurchaseRequest } from "@/store/slice/listing.slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState, useAppSelector } from "@/store";
import { RiBuilding2Line, RiUser6Line } from "react-icons/ri";
import InspectionCard from "./_components/inspection-card";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { MdVerified } from "react-icons/md";
import { IoBedOutline, IoCopyOutline } from "react-icons/io5";
import { TbResize } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BidModal } from "./_components/bid-modal";

const customIcon = new Icon({
  iconUrl: "/marker.svg",
  iconSize: [35, 51],
  iconAnchor: [12, 41],
});

export default function PropertyDetailsPage() {
  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  const { getContractInstance } = useContractInstance();

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
        value: `#${_listing?.id}`,
      },
      {
        label: "Rooms",
        value: _listing?.details?.rooms ?? "N/A",
      },
      {
        label: "Year built",
        value: formatDate(_listing?.details?.yearBuilt) ?? "N/A",
      },
      {
        label: "Structure type",
        value: _listing?.details?.structureType ?? "N/A",
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

      const user_construct = formatUser(user);

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
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const fetchPurchaseRequests = async () => {
    if (isLoadingRequests) return;
    try {
      setIsLoadingRequests(true);
      const contract = getContractInstance();
      const purchase_requests =
        await contract.get_listing_purchase_requests(id);

      const structured = purchase_requests.map((request: any) => {
        const user = request.user.Some;

        const user_construct = formatUser(user);

        const request_construct: PurchaseRequest = {
          initiator: toHex(request.initiator),
          listing_id: Number(request.listing_id),
          price: Number(request.price),
          request_id: Number(request.request_id),
          user: user_construct,
        };
        return request_construct;
      });

      setPurchaseRequests(structured);
      setIsLoadingRequests(false);
    } catch (error) {
      console.log(error);
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchPurchaseRequests();
  }, [id]);

  useEffect(() => {
    setContent({ ...content, message: listing?.details?.title });
  }, [listing]);

  const { credential } = useAppSelector((state: RootState) => state.credential);
  const { hasRegistered } = useAppSelector((state: RootState) => state.wallet);

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

  console.log(listing?.details?.interior);

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

      <div className="flex flex-1 flex-col gap-10 rounded-md sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:rounded-3xl md:p-10">
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
            {hasRegistered && !isLoadingRequests && listing?.tag !== "Sold" && (
              <BidModal
                listing={listing ?? undefined}
                purchaseRequests={purchaseRequests}
                setPurchaseRequests={setPurchaseRequests}
              >
                <Button className="flex-1">
                  <BiLeaf className="size-5" />
                  <span>Purchase/Rent</span>
                </Button>
              </BidModal>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size="icon">
                  <Share2 className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                sideOffset={10}
                className="mr-5 rounded-3xl md:mr-8 lg:mr-10 xl:mr-16"
              >
                <div className="flex items-center justify-center gap-4 p-4">
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
                      copyToClipboard(
                        content.url,
                        `Copied "${listing?.details?.title}"`,
                      );
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
              <p className="text-base font-semibold uppercase md:text-lg">
                Description
              </p>
              <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-sm md:text-base">
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
              <p className="text-base font-semibold uppercase md:text-lg">
                Address
              </p>

              <div className="grid grid-cols-2 gap-8 border-t pt-4">
                {addresses.map((addr: any, index: number) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      {addr.label}
                    </span>
                    <span className="text-base font-medium">{addr?.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-base font-semibold uppercase md:text-lg">
                Details
              </p>

              <div className="grid grid-cols-2 gap-8 border-t pt-4">
                {details.map((dtls: any) => (
                  <div key={dtls.label} className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      {dtls.label}
                    </span>
                    <span className="text-base font-medium">{dtls.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      {/* Bidding info*/}
      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:rounded-3xl md:p-10">
        <div className="flex flex-col gap-0.5 sm:mb-6">
          <p className="text-base font-semibold uppercase md:text-lg">
            Bidding Info
          </p>
          <p>
            View current bids, bidding status, and auction details for this
            property.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden text-sm font-normal sm:text-base sm:font-medium xl:flex xl:items-center">
                #ID
              </TableHead>
              <TableHead className="w-[380px] text-sm font-normal sm:text-base sm:font-medium md:w-[480px]">
                Initiator
              </TableHead>
              <TableHead className="hidden text-sm font-normal sm:text-base sm:font-medium lg:flex lg:items-center">
                Initiator's Address
              </TableHead>
              <TableHead className="text-right text-sm font-normal sm:text-base sm:font-medium">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingRequests ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-20">
                    <Skeleton className="size-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : purchaseRequests.length > 0 ? (
              purchaseRequests
                .sort((a, b) => b.price - a.price)
                .map((request, index) => (
                  <TableRow key={index} className="overflow-x-auto">
                    <TableCell className="hidden sm:h-20 xl:flex xl:items-center">
                      #{request.request_id}
                    </TableCell>
                    <TableCell className="w-[380px] sm:h-20 md:w-[480px]">
                      <Link
                        to={`/profile?address=${request?.user?.address}`}
                        className="flex w-max items-center gap-2.5 md:gap-3"
                      >
                        <div className="size-12 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-0.5">
                          <div className="size-full rounded-full bg-background p-0.5">
                            <img
                              src={generateAvatarFromAddress(
                                request?.initiator,
                              )}
                              alt={request?.user?.details.name}
                              width={64}
                              height={64}
                              className="size-full rounded-full object-contain"
                            />
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <p className="line-clamp-1 flex-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary md:text-base">
                              {request?.user?.details.name}
                            </p>
                            {request?.user?.verified && (
                              <MdVerified className="mt-px size-4 text-primary" />
                            )}
                          </div>
                          <p className="hidden text-xs font-medium text-primary sm:flex sm:text-sm">
                            {request?.user?.user_type}
                          </p>
                          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:hidden sm:gap-3 sm:text-sm">
                            {truncateAddr(request?.user?.address, 8)}{" "}
                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                copyToClipboard(request?.initiator);
                              }}
                            >
                              <IoCopyOutline className="size-3 sm:!size-3.5" />
                            </span>
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:h-20 lg:flex lg:items-center">
                      <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        {truncateAddr(request?.user?.address, 8)}{" "}
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            copyToClipboard(request?.initiator);
                          }}
                        >
                          <IoCopyOutline className="!size-3.5" />
                        </span>
                      </p>
                    </TableCell>

                    <TableCell className="text-right font-medium sm:h-20">
                      ${request.price.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex h-48 items-center justify-center">
                    <p className="mt-5 max-w-xs text-center text-sm font-normal sm:text-base">
                      This property appears to be either sold out or not up for
                      bid.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Separator className="my-2 h-px w-full" />

      {/* INTERIOR, OUTDOOR & UTILITIES DETAILS */}
      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:rounded-3xl md:p-10 2xl:flex-row">
        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-20 lg:grid-cols-3">
          <div className="flex flex-col gap-6">
            <p className="text-base font-medium">Interior Details</p>

            <ul className="flex flex-col gap-3 pl-4">
              {listing?.details?.interior?.map((int: any, key: number) => (
                <li
                  key={key}
                  className="list-disc text-sm text-muted-foreground"
                >
                  {int.text ?? int}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-base font-medium">Outdoor Details</p>

            <ul className="flex flex-col gap-3 pl-4">
              {listing?.details?.exterior?.map((ext: any, key: number) => (
                <li
                  key={key}
                  className="list-disc text-sm text-muted-foreground"
                >
                  {ext.text ?? ext}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-base font-medium">Utilities</p>

            <ul className="flex flex-col gap-3 pl-4">
              {listing?.details?.utilities?.map((utils: any, key: number) => (
                <li
                  key={key}
                  className="list-disc text-sm text-muted-foreground"
                >
                  {utils.text ?? utils}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      {/* FLOOR PLANS AND VIDEO */}
      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:rounded-3xl md:p-10 2xl:flex-row">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          {listing?.details?.videosCid?.length && (
            <div className="aspect-video flex-1 bg-secondary">
              <video controls className="size-full">
                <source
                  src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details.videosCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                />
              </video>
            </div>
          )}

          <Carousel className="xl:min-h-[350px]">
            <CarouselContent>
              {listing?.details?.floorPlanCid?.map(
                (floorPlanCid: any, index: number) => (
                  <CarouselItem key={index} className="aspect-[1.5]">
                    <div className="size-full overflow-hidden rounded-md border bg-secondary md:rounded-xl">
                      <img
                        src={`${import.meta.env.VITE_PINATA_GATEWAY}/${floorPlanCid}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                        alt="floor plan"
                        className="size-full object-contain"
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

      {/* AGENT DETAILS & MAP */}
      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:rounded-3xl md:p-10 2xl:flex-row">
        <div className="flex w-full flex-col gap-6 sm:max-w-full xl:max-w-full xl:flex-row 2xl:max-w-lg 2xl:flex-col">
          <div className="flex flex-1 flex-col gap-7 rounded-2xl border p-6 sm:p-8">
            <div className="flex flex-col gap-3">
              <p className="text-xl font-medium">Property Agent</p>

              <div className="flex items-center gap-2.5 md:gap-3">
                <div className="size-14 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-0.5">
                  <div className="size-full rounded-full bg-background p-0.5">
                    <img
                      src={generateAvatarFromAddress(
                        listing?.owner_details?.address as string,
                      )}
                      alt={listing?.owner_details?.details.name}
                      width={64}
                      height={64}
                      className="size-full rounded-full object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary md:text-base">
                      {listing?.owner_details?.details.name}
                    </p>
                    {listing?.owner_details?.verified && (
                      <MdVerified className="mt-px size-4 text-primary" />
                    )}
                  </div>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                    {truncateAddr(listing?.owner_details?.address)}{" "}
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        copyToClipboard(
                          listing?.owner_details?.address as string,
                        );
                      }}
                    >
                      <IoCopyOutline className="size-3 sm:!size-3.5" />
                    </span>
                  </p>
                </div>

                <p className="ml-auto flex items-center gap-2 text-xs font-medium text-primary sm:text-sm">
                  {listing?.owner_details?.user_type}
                </p>
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

        {/* dangerouslySetInnerHTML={{ __html: listing?.details?.map }}  */}
        {(listing?.details?.map?.name &&
          listing?.details?.map?.lat &&
          listing?.details?.map?.long) ||
        listing?.details?.map?.lng ? (
          <div className="-z-0 aspect-[1.4] w-full flex-1 overflow-hidden rounded-xl border bg-secondary sm:rounded-2xl md:rounded-3xl">
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
            className="-z-0 aspect-[1.4] w-full flex-1 overflow-hidden rounded-xl border bg-secondary sm:rounded-2xl md:rounded-3xl"
          ></div>
        )}
      </div>

      <Separator className="my-2 h-px w-full" />

      <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-[#F9FAFB] sm:p-6 md:rounded-3xl md:p-10 2xl:flex-row">
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
                    License #{_index + 1}
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
