import { FC, memo, useState } from "react";
import { motion } from "framer-motion";
import { IoMdArrowForward } from "react-icons/io";
import { RxClock } from "react-icons/rx";
import { PiBuildingOfficeLight } from "react-icons/pi";
import { LiaEthereum } from "react-icons/lia";

import MaxWrapper from "@/components/shared/max-wrapper";
import { variants } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";

const Latest: FC = () => {
  const { fadeIn } = variants;
  const navigate = useNavigate();
  const fadInAnimate = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.8,
        delay: 0.2 * index,
      },
    }),
  };

  const [activeCard, setActiveCard] = useState(1);
  const { listings } = useAppSelector(state => state.listing)


  return (
    <MaxWrapper>
      <div className="my-16 flex flex-col gap-7 md:my-32 md:gap-14">
        <div className="flex items-end justify-between">
          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{
              once: true,
              amount: 0.7,
            }}
            className="flex flex-col gap-2 md:gap-0"
          >
            <h2 className="font-normal text-[#032724] md:leading-[80px]">
              Latest Updates
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              Below are a list of some of our featured properties,
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{
              once: true,
              amount: 0.7,
            }}
          >
            <Button onClick={() => {
              navigate("/listings")
            }} variant={"black"} className="hidden px-6 md:flex">
              <span>See More</span>{" "}
              <IoMdArrowForward size={22} className="ml-3" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(-3).map((property, _index) => (
            <motion.div
              variants={fadInAnimate}
              initial="initial"
              whileInView={"animate"}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              onMouseOver={() => setActiveCard(_index + 1)}
              key={_index}
              custom={_index}
              className="flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-2 bg-background shadow-2xl shadow-black/20">
                <div
                  className={cn(
                    "absolute bottom-0 left-0 z-10 h-full w-full overflow-hidden rounded-2xl bg-background/80 transition-all duration-500",
                    {
                      "h-[30%] brightness-50": activeCard === _index + 1,
                    },
                  )}
                >
                  <img
                    src={`${import.meta.env.VITE_PINATA_GATEWAY}/${property?.details?.imagesCid[0]}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                    alt={property?.details?.title}
                    className={cn(
                      "size-full object-cover delay-200 duration-300",
                      {
                        "scale-110": activeCard === _index + 1,
                      },
                    )}
                  />
                </div>

                <div
                  className={cn(
                    "flex size-full flex-col gap-2 rounded-2xl px-6 pt-16 opacity-0 transition-all delay-300",
                    {
                      "pt-8 opacity-100": activeCard === _index + 1,
                    },
                  )}
                >
                  <h3 className="flex items-center font-normal text-[#032724]">
                    <LiaEthereum className="mr-1 size-8" />
                    {property?.price.toLocaleString()}
                  </h3>

                  <p className="flex items-center text-base font-medium">
                    <span className="line-clamp-1 flex-1">
                      {property?.details?.area} - {property?.details?.region?.state?.stateName}, {property?.details?.region?.country?.countryName}
                    </span>
                  </p>

                  <div className="mt-4 flex items-center gap-4">
                    <p className="flex items-center text-sm text-muted-foreground sm:text-base">
                      <RxClock size={18} className="mr-2" />
                      {formatDate(property?.details?.yearBuilt)}
                    </p>
                    <p className="flex items-center text-sm text-muted-foreground sm:text-base">
                      <PiBuildingOfficeLight size={18} className="mr-2" />
                      {property?.details?.propertySize}sqm
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MaxWrapper>
  );
};

export default memo(Latest);
