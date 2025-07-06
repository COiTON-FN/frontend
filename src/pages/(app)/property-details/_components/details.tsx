import * as React from "react";
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
import { PiBathtub, PiIslandDuotone } from "react-icons/pi";
import { BiLeaf } from "react-icons/bi";
import { Link as LinkIcon, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoBedOutline } from "react-icons/io5";
import { TbResize } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BidModal } from "./bid-modal";
import { RootState, useAppSelector } from "@/store";
import { RiBuilding2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { cn, copyToClipboard } from "@/lib/utils";
import { Listing, PurchaseRequest } from "@/store/slice/listing.slice";
import { Skeleton } from "@/components/ui/skeleton";

type DetailsAddress = Array<{ label: string; value: string }>;

interface DetailsProps {
  listing: Listing | null;
  content: {
    url: string;
    message: string;
  };
  isLoadingRequests: boolean;
  purchaseRequests: Array<PurchaseRequest>;
  setPurchaseRequests: React.Dispatch<
    React.SetStateAction<Array<PurchaseRequest>>
  >;
  addresses: DetailsAddress;
  details: DetailsAddress;
}

export const Details: React.FC<DetailsProps> = ({
  listing,
  content,
  isLoadingRequests,
  purchaseRequests,
  setPurchaseRequests,
  addresses,
  details,
}) => {
  const [showMore, setShowMore] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const { hasRegistered } = useAppSelector((state: RootState) => state.wallet);

  return (
    <div className="flex flex-1 flex-col gap-10 rounded-md sm:rounded-2xl sm:border sm:bg-background sm:p-6 md:rounded-3xl md:p-10">
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
          {isLoadingRequests ? (
            <Skeleton className="h-11 w-36 rounded-full bg-secondary" />
          ) : (
            hasRegistered &&
            listing?.tag !== "Sold" && (
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
            )
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
                    (selectedImage || listing?.details?.imagesCid[0]) === image
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
  );
};
