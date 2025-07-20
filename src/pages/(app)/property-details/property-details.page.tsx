import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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

import { byteArrayToString, toHex } from "@/lib/starknet/utils";
import { Fragment, useEffect, useState } from "react";
import {
  formatDate,
  formatUnits,
  formatUser,
  generateAvatarFromAddress,
  truncateAddr,
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { toast } from "sonner";
import { Listing, PurchaseRequest } from "@/store/slice/listing.slice";
import { RootState, useAppSelector } from "@/store";
import { RiUser6Line } from "react-icons/ri";
import InspectionCard from "./_components/inspection-card";

import { MdVerified } from "react-icons/md";
import { BiddingInfo } from "./_components/bidding-info";
import { Details } from "./_components/details";
import { SEO } from "@/components/shared/seo";
import { ClipboardCopy } from "@/components/shared/clipboard-copy";
import { ListingMap } from "./_components/listing-map";

export default function PropertyDetailsPage() {
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
          price: Number(formatUnits(Number(request.price).toLocaleString("fullwide", { useGrouping: false }))),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { credential } = useAppSelector((state: RootState) => state.credential);

  if (loading)
    return (
      <div className="flex flex-col gap-4 py-4">
        <Skeleton className="aspect-video rounded-xl bg-background sm:rounded-2xl md:rounded-3xl" />
        <Skeleton className="aspect-video rounded-xl bg-background sm:rounded-2xl md:rounded-3xl" />
      </div>
    );

  const isOwner =
    (credential?.address ?? "").toLowerCase() ===
    (listing?.owner ?? "").toLowerCase();

  return (
    <Fragment>
      <SEO
        title={listing?.details?.title || "Loading..."}
        description={listing?.details?.description || "Loading..."}
        keywords={listing?.details?.title?.split(" ").join(", ")}
        image={
          listing
            ? `${import.meta.env.VITE_PINATA_GATEWAY}/${listing?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`
            : ""
        }
      />

      <div className="flex flex-col gap-4 py-4">
        {/* Details */}
        <Details
          listing={listing}
          shareUrl={window.location.href}
          isLoadingRequests={isLoadingRequests}
          purchaseRequests={purchaseRequests}
          setPurchaseRequests={setPurchaseRequests}
          addresses={addresses}
          details={details}
        />

        <Separator className="my-2 h-px w-full" />

        {/* Bidding info*/}
        <BiddingInfo
          isLoadingRequests={isLoadingRequests}
          purchaseRequests={purchaseRequests}
          isOwner={isOwner}
        />

        <Separator className="my-2 h-px w-full" />

        {/* INTERIOR, OUTDOOR & UTILITIES DETAILS */}
        <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:rounded-3xl md:p-10 2xl:flex-row">
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
        <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:rounded-3xl md:p-10 2xl:flex-row">
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
                    <CarouselItem key={index} className="aspect-[1.5] w-full">
                      <div className="aspect-[1.5] size-full overflow-hidden rounded-md border bg-secondary md:rounded-xl">
                        <img
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

        {/* AGENT DETAILS & MAP */}
        <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:rounded-3xl md:p-10">
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-1 flex-col gap-7 rounded-2xl border bg-background p-6 dark:bg-neutral-950 sm:p-8">
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
                    <ClipboardCopy
                      value={listing?.owner_details?.address || ""}
                      message="Agent address copied successfully"
                    >
                      <span className="text-xs text-muted-foreground sm:text-sm">
                        {truncateAddr(listing?.owner_details?.address)}
                      </span>
                    </ClipboardCopy>
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
                className="mt-auto rounded-full"
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

          <ListingMap listing={listing} />
        </div>

        <Separator className="my-2 h-px w-full" />

        <div className="flex flex-1 flex-col gap-5 sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:rounded-3xl md:p-10 2xl:flex-row">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {listing?.details?.licenseCid &&
              listing?.details?.licenseCid.map((_: unknown, _index: number) => (
                <div
                  key={_index}
                  className="flex items-center gap-4 rounded-2xl border bg-secondary p-4 dark:bg-neutral-950"
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
    </Fragment>
  );
}
