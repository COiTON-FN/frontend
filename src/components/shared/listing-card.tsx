import { motion } from "framer-motion";
import { cn, generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { Listing } from "@/store/slice/listing.slice";
import { memo } from "react";
import { PiBathtub, PiIslandDuotone } from "react-icons/pi";
import { RiBuilding2Line } from "react-icons/ri";
import { IoBedOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbResize } from "react-icons/tb";
import { FaRegImages } from "react-icons/fa6";
import { PiVideo } from "react-icons/pi";
import { MdVerified } from "react-icons/md";

const ListingCard = ({
  listing,
  index,
}: {
  listing: Listing;
  index?: number;
}) => {
  const { details, owner_details } = listing;

  return (
    <Link to={`/properties/${listing.id}`} state={listing}>
      <motion.div
        variants={{
          initial: { opacity: 0, y: 100 },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.05 * (index ?? 1),
              duration: 0.9,
              type: "spring",
            },
          },
        }}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        custom={index}
        className="group w-full rounded-[32px] border bg-background shadow-sm transition-shadow duration-500 hover:shadow-xl"
      >
        <div className="relative aspect-[1.6] w-full overflow-hidden rounded-[30px] border-b bg-secondary">
          <img
            src={`${import.meta.env.VITE_PINATA_GATEWAY}/${details.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
            alt={details?.title}
            className="size-full origin-top object-cover brightness-75 transition-transform duration-500 ease-in-out group-hover:scale-125"
          />
          <div
            className={cn(
              "absolute right-4 top-4 flex h-7 items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-2.5 text-green-700",
              {
                "border-red-300 bg-red-50 text-destructive":
                  listing.tag !== "ForSale",
              },
            )}
          >
            <span
              className={cn("size-2.5 rounded-full bg-green-700", {
                "bg-destructive": listing.tag !== "ForSale",
                "animate-pulse": listing.tag === "ForSale",
              })}
            />
            <span className="text-xs font-medium">
              {listing.tag === "ForSale" ? "For Sale" : "Sold Out"}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border bg-background px-3.5 py-1.5">
            {details?.propertyType === "land" ? (
              <PiIslandDuotone className="size-4" />
            ) : (
              <RiBuilding2Line className="size-4" />
            )}
            <span className="text-[13px] font-medium capitalize">
              {details.propertyType ?? "building"}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <div className="flex h-6 items-center gap-1.5 rounded-full border bg-background px-2.5">
              <FaRegImages className="size-4" />
              <span className="text-[13px] font-medium capitalize">
                {details.imagesCid.length ?? 0}
              </span>
            </div>
            {details?.videosCid && (
              <div className="flex h-6 items-center gap-1.5 rounded-full border bg-background px-2">
                <PiVideo className="size-5" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="line-clamp-1 text-lg font-medium md:text-xl">
              {details?.title}
            </span>
            <p className="ml-auto text-base font-semibold leading-none tracking-wide text-primary md:text-lg">
              ${Number(details?.price).toLocaleString()}
            </p>
          </div>

          <div className="flex w-max items-center gap-2">
            <div className="size-11 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-0.5">
              <div className="size-full rounded-full bg-background p-0.5">
                <img
                  src={generateAvatarFromAddress(
                    owner_details?.address as string,
                  )}
                  alt={owner_details?.details.name}
                  width={64}
                  height={64}
                  className="size-full rounded-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-0.5">
              <div className="flex items-center gap-1.5">
                <p className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {owner_details?.details.name}
                </p>
                {owner_details?.verified && (
                  <MdVerified className="size-4 text-primary" />
                )}
              </div>
              <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                {truncateAddr(owner_details?.address, 8)}
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between divide-x">
            <p className="flex flex-1 items-center justify-center gap-2 text-muted-foreground">
              <IoBedOutline className="size-5" />

              <span className="text-sm">
                Beds: <strong>{details?.bedrooms ?? 0}</strong>
              </span>
            </p>
            <p className="flex flex-1 items-center justify-center gap-2 text-muted-foreground">
              <PiBathtub className="size-5" />

              <span className="text-sm">
                Baths: <strong>{details?.bathrooms ?? 0}</strong>
              </span>
            </p>
            <p className="flex flex-1 items-center justify-center gap-2 text-muted-foreground">
              <TbResize className="size-4" />

              <span className="text-sm">
                Sqft:{" "}
                <strong>{(details?.propertySize ?? 0).toLocaleString()}</strong>
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default memo(ListingCard);
