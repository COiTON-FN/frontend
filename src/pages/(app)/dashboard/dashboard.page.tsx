import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { variants } from "@/utils/constants";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BsInbox } from "react-icons/bs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ListingCard from "@/components/shared/listing-card";
import { useAppSelector } from "@/store";
import { Listing } from "@/store/slice/listing.slice";
import { IoMdCopy } from "react-icons/io";
import React from "react";
import { SEO } from "@/components/shared/seo";

export default function DashboardPage() {
  const { fadeIn } = variants;
  const { listings, isLoading } = useAppSelector((state) => state.listing);

  return (
    <React.Fragment>
      <SEO page="dashboard" />

      <div className="flex flex-col gap-4 py-4">
        <div className="h-[200px] w-full rounded-2xl bg-gradient-to-l from-[#0D857C] to-[#0EB9AC] p-[1px] sm:h-[240px] md:rounded-3xl">
          <div className="flex size-full overflow-hidden rounded-[inherit] bg-gradient-to-r from-[#056F67] to-[#0AADA1] text-white">
            <div className="lg:px-12">
              <div className="mx-auto size-full border-[#0FAB9F] lg:border-x">
                <div className="flex size-full items-center justify-center">
                  <div className="flex w-full flex-col gap-1 border-y border-[#0FAB9F] px-6 py-4 lg:p-4">
                    <h4 className="text-2xl font-normal italic tracking-wider sm:text-3xl">
                      Empowering Decentralized Real Estate for All.
                    </h4>
                    <span className="text-base font-light text-[#B1EDE9] lg:text-xl">
                      Invest, Verify, and Unlock Real Estate Potential
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden h-full flex-1 xl:flex">
              <img
                className="pointer-events-none absolute bottom-0 right-0 z-[1] w-[550px] select-none"
                src={assets.svgs.dashboardHeader}
                width={671}
                height={447}
              />
              <motion.img
                variants={fadeIn("up", 0.6)}
                initial="show"
                whileInView={"show"}
                viewport={{
                  once: true,
                  amount: 0.7,
                }}
                animate={{
                  rotate: 10,
                  translateY: [-5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 3,
                  ease: "easeInOut",
                }}
                src={assets.shapes.flatShape}
                alt="NOODLE SHAPE"
                className="pointer-events-none absolute -bottom-[200px] -left-28 z-0 select-none"
                width={699}
                height={519}
              />
            </div>
          </div>
        </div>

        <Separator className="my-2 h-px w-full" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          <div className="relative h-max w-full overflow-hidden rounded-2xl border bg-[rgb(251,255,255)] dark:bg-background md:h-96 md:rounded-3xl">
            <div className="my-6 flex h-[55px] flex-col px-8 md:px-10">
              <p className="text-2xl font-medium text-primary">Bidding</p>
              <p className="text-base font-normal text-primary">
                Place bids on the property you eamt
              </p>
            </div>

            <img src={assets.images.bidLg} className="size-full" />
          </div>

          <div className="dark-[#3A9992] relative h-max w-full overflow-hidden rounded-2xl border border-[#056F67] bg-primary md:h-96 md:rounded-3xl">
            <div className="relative z-[5] my-4 flex h-[55px] items-center justify-between px-8 md:px-10">
              <div className="flex items-center gap-3">
                <span className="size-[7px] rounded-full bg-[#3A9992]" />
                <p className="text-2xl font-medium text-white">Trading</p>
              </div>
              <p className="text-sm text-[#0EC0B2]">Coming Soon</p>
            </div>

            <img
              src={assets.svgs.propertyManagement}
              className="pointer-events-none absolute right-0 z-[1] -mt-16 size-full h-[632px] w-[409px] object-cover"
            />
          </div>

          <div className="aspect-[1.3] h-max w-full rounded-2xl bg-gradient-to-bl from-[#FFE692] to-[#B69C46] p-px text-[#9C7800] md:aspect-[1.8] md:h-96 md:flex-1 md:rounded-[24px] lg:aspect-auto">
            <div className="relative flex size-full flex-col justify-between overflow-hidden rounded-[inherit] bg-[#FFFCF2] p-6 dark:bg-neutral-950 md:px-10 md:py-12">
              <h2 className="text-[40px] font-normal leading-[50px] md:text-5xl lg:leading-[1.1]">
                Dive Deeper into Coiton
              </h2>

              <Link
                to="https://hooopesteams-organization.gitbook.io/hooopes-team"
                target="_blank"
                className="w-max"
              >
                <Button
                  size={"lg"}
                  className="w-max rounded-full !bg-[#9C7800] hover:!bg-[#9C7800]/90"
                >
                  <span>View Whitepaper</span>{" "}
                  <IoMdCopy size={22} className="ml-3" />
                </Button>
              </Link>

              <div className="absolute -right-[170px] top-10 z-0 md:-right-[210px] md:-top-[20px] md:size-[424px] lg:-top-[50px] lg:size-[324px]">
                <div className="rotate-[35deg]">
                  <img
                    src={assets.shapes.octYellowShape}
                    alt="OCTERGON SHAPE"
                    className="size-80 brightness-90 md:size-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-2 h-px w-full" />

        <div className="rounded-2xl md:rounded-3xl md:border md:bg-background">
          {isLoading ? (
            <div className="mx-auto grid grid-cols-1 gap-4 overflow-y-auto py-6 md:gap-6 md:p-6 lg:grid-cols-2 2xl:grid-cols-3">
              {[...new Array(3)].map((_, _index) => (
                <div
                  key={_index}
                  className="group rounded-[24px] bg-white dark:bg-neutral-900"
                >
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
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="flex aspect-[3.2] w-full flex-col items-center justify-center">
              <BsInbox className="size-24 text-muted-foreground" />
              <p className="text-xl font-medium text-muted-foreground">
                No active property
              </p>
            </div>
          ) : (
            <div className="mx-auto grid grid-cols-1 gap-4 overflow-y-auto py-6 md:gap-6 md:p-6 lg:grid-cols-2 2xl:grid-cols-3">
              {listings.slice(0, 3)?.map((listing: Listing, index: number) => {
                return (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    index={index}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
