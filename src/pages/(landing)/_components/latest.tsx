import { FC, memo } from "react";
import { motion } from "framer-motion";
import { IoMdArrowForward } from "react-icons/io";

import MaxWrapper from "@/components/shared/max-wrapper";
import { variants } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";
import ListingCard from "@/components/shared/listing-card";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { listings } = useAppSelector((state) => state.listing);

  if (listings.length === 0)
    return (
      <div className="my-16 flex flex-col gap-7 md:my-32 md:gap-14">
        <MaxWrapper>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...new Array(3)].map((_, _index) => (
              <motion.div
                variants={fadInAnimate}
                initial="initial"
                whileInView={"animate"}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                key={_index}
                custom={_index}
              >
                <div className="group rounded-[24px] bg-background">
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
              </motion.div>
            ))}
          </div>
        </MaxWrapper>
      </div>
    );

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
            <h2 className="font-normal text-primary md:leading-[80px]">
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
            <Button
              onClick={() => {
                navigate("/properties");
              }}
              variant={"black"}
              className="hidden px-6 md:flex"
            >
              <span>See More</span>{" "}
              <IoMdArrowForward size={22} className="ml-3" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(0, 3).map((listing, index) => (
            <ListingCard key={listing.id} listing={listing} index={index} />
          ))}
        </div>
      </div>
    </MaxWrapper>
  );
};

export default memo(Latest);
