import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Listing } from "@/store/slice/listing.slice";
import { memo } from "react";
import { PiBathtub, PiIslandDuotone } from "react-icons/pi";
import { RiBuilding2Line } from "react-icons/ri";
import { IoBedOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbResize } from "react-icons/tb";
import { FaRegImages } from "react-icons/fa6";
import { PiVideo } from "react-icons/pi";

const ListingCard = ({
  listing,
  index,
}: {
  listing: Listing;
  index?: number;
}) => {
  const { details } = listing;

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
          hover: {
            scale: 1.04,
          },
        }}
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        viewport={{ once: true }}
        custom={index}
        className="group w-full rounded-[24px] border bg-background shadow-md transition-shadow duration-500 hover:shadow-xl"
      >
        <div className="relative aspect-[1.4] w-full overflow-hidden rounded-[22px] bg-secondary md:h-[240px]">
          <img
            src={`${import.meta.env.VITE_PINATA_GATEWAY}/${details.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
            alt={details?.title}
            className="size-full origin-top object-cover brightness-75 transition-transform duration-500 ease-in-out group-hover:scale-125"
          />
          <div
            className={cn(
              "absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-2.5 py-1 text-green-700",
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
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5">
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
            <div className="flex h-6 items-center gap-1.5 rounded-full bg-white px-2.5">
              <FaRegImages className="size-4" />
              <span className="text-[13px] font-medium capitalize">
                {details.imagesCid.length ?? 0}
              </span>
            </div>
            {details?.videosCid && (
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-white px-2.5">
                <PiVideo className="size-5" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <p className="text-xl font-semibold leading-none tracking-wide text-primary md:text-2xl">
            ${Number(details?.price).toLocaleString()}
          </p>

          <div className="flex flex-col gap-1.5">
            <span className="line-clamp-1 text-lg font-medium leading-none text-[#1D2939] md:text-xl">
              {details?.title}
            </span>

            <span className="line-clamp-1 text-sm font-normal leading-none text-[#475467] sm:text-base">
              {details?.area} - {details?.region?.state?.stateName},{" "}
              {details?.region?.country?.countryName}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between divide-x">
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
