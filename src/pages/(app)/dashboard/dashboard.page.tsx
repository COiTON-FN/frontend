import { assets } from "@/assets";
import ListingBoard from "@/components/shared/listing-board";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { variants } from "@/utils/constants";
import { motion } from "framer-motion";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { LuMailWarning } from "react-icons/lu";
import { Link } from "react-router-dom";
import { BsInbox } from "react-icons/bs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ListingCard from "@/components/shared/listing-card";
import { useAppSelector } from "@/store";
import { Listing } from "@/store/slice/listing.slice";

const updates = [
  {
    status: "pending",
  },
  {
    status: "approved",
  },
  {
    status: "denied",
  },
];



export default function DashboardPage() {
  const { fadeIn } = variants;

  const { listings } = useAppSelector(state => state.listing);

  // const chii = async () => {
  //   try {
  //     const response = await apiClient.post("/listing", { tx_hash: "0x0655ee38395dbc433d83981c72a1ea42637f94ae72fb0389b9d758f0f7c34a0c" });
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* <button onClick={chii}>click</button> */}
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
        <div className="relative flex h-max w-full flex-col justify-between overflow-hidden rounded-3xl border border-[#E8E3F7] bg-[#F9F7FF] md:h-[422px]">
          <div className="my-4 flex h-[55px] items-center justify-between px-6 md:px-8">
            <p className="text-lg font-medium text-[#3001BF]">
              Market Snapshot
            </p>
          </div>

          <div className="mt-10 px-6 py-5 md:mt-0 md:px-8 md:py-10">
            <h4 className="text-3xl font-medium -tracking-[6%] text-[#3001BF] md:text-4xl">
              Coiton Token
            </h4>
            <p className="text-base font-medium text-[#BAAEE0]">
              Launching Soon
            </p>
          </div>

          <div className="absolute -bottom-4 -right-24 h-[200px] w-[250px] rotate-[17deg] md:h-[300px] md:w-[350px]">
            <img
              src={assets.images.tokenBlue}
              width={442}
              height={442}
              className="absolute z-[3]"
            />
            <img
              src={assets.images.tokenGreen}
              width={442}
              height={442}
              className="absolute z-[2] ml-4 mt-4"
            />
            <img
              src={assets.images.tokenPink}
              width={442}
              height={442}
              className="absolute z-[1] ml-8 mt-8"
            />
          </div>
        </div>

        <div className="h-max w-full overflow-hidden rounded-2xl border border-[#F6F1DE] bg-[#FFFDF7] md:h-[422px] md:rounded-3xl">
          <div className="my-4 flex h-[55px] items-center justify-between px-6 md:px-8">
            <p className="text-lg font-medium text-[#AE8600]">DAO Updates</p>

            <Button className="w-max border border-[#F6F1DE] !bg-[#FBF5DF] px-5 text-[#AE8600] hover:!bg-[#FBF5DF]/90">
              <span className="text-sm font-medium">View More</span>
              <svg
                width="12"
                height="11"
                viewBox="0 0 12 11"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1 fill-none"
              >
                <path
                  d="M11.8538 5.85354L7.35375 10.3535C7.25993 10.4474 7.13268 10.5001 7 10.5001C6.86732 10.5001 6.74007 10.4474 6.64625 10.3535C6.55243 10.2597 6.49972 10.1325 6.49972 9.99979C6.49972 9.86711 6.55243 9.73986 6.64625 9.64604L10.2931 5.99979H0.5C0.367392 5.99979 0.240215 5.94711 0.146447 5.85334C0.0526785 5.75958 0 5.6324 0 5.49979C0 5.36718 0.0526785 5.24 0.146447 5.14624C0.240215 5.05247 0.367392 4.99979 0.5 4.99979H10.2931L6.64625 1.35354C6.55243 1.25972 6.49972 1.13247 6.49972 0.99979C6.49972 0.867108 6.55243 0.73986 6.64625 0.64604C6.74007 0.552219 6.86732 0.499512 7 0.499512C7.13268 0.499512 7.25993 0.552219 7.35375 0.64604L11.8538 5.14604C11.9002 5.19248 11.9371 5.24762 11.9623 5.30832C11.9874 5.36902 12.0004 5.43408 12.0004 5.49979C12.0004 5.5655 11.9874 5.63056 11.9623 5.69126C11.9371 5.75196 11.9002 5.8071 11.8538 5.85354Z"
                  className="fill-[#AE8600]"
                />
              </svg>
            </Button>
          </div>

          <div className="h-[300px] overflow-hidden rounded-b-[inherit] md:h-[342px]">
            <div className="size-full px-6 md:px-8">
              {updates.map(({ status }) => (
                <Link
                  to="/dashboard"
                  key={status}
                  className={cn(
                    "mb-3 flex h-[75px] items-center justify-between rounded-[10px] border px-6 last:mb-8",
                    {
                      "border-[#EAE1C2] bg-[#FFFEE9]/80 text-[#D4A300]":
                        status === "pending",
                      "border-[#C2EADB] bg-[#E9FAF0]/80 text-[#00914B]":
                        status === "approved",
                      "border-[#EAC2C2] bg-[#FAE9E9]/80 text-[#FF3E3E]":
                        status === "denied",
                    },
                  )}
                >
                  <p className="w-[176px] truncate text-base font-medium">
                    2 Bedroom, Air conditoned Bungalow with furnished
                  </p>

                  <p className="font-sans_regular flex items-center gap-2 text-sm capitalize">
                    <span>{status}</span>
                    {status === "pending" ? (
                      <FiClock className="size-4" />
                    ) : status === "approved" ? (
                      <FiCheckCircle className="size-4" />
                    ) : (
                      <LuMailWarning className="size-4" />
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="h-max w-full overflow-hidden rounded-2xl border border-[#DCF7F5] bg-[#F5FFFE] md:h-[422px] md:rounded-3xl">
          <div className="my-4 flex h-[55px] items-center justify-between px-6 md:px-8">
            <p className="text-lg font-medium text-primary">Your Properties</p>

            <Button className="w-max border border-[#DCF7F5] !bg-[#E8FDFC] px-5 text-primary hover:!bg-[#E8FDFC]/90">
              <span className="text-sm font-medium">View More</span>
              <svg
                width="12"
                height="11"
                viewBox="0 0 12 11"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1 fill-none"
              >
                <path
                  d="M11.8538 5.85354L7.35375 10.3535C7.25993 10.4474 7.13268 10.5001 7 10.5001C6.86732 10.5001 6.74007 10.4474 6.64625 10.3535C6.55243 10.2597 6.49972 10.1325 6.49972 9.99979C6.49972 9.86711 6.55243 9.73986 6.64625 9.64604L10.2931 5.99979H0.5C0.367392 5.99979 0.240215 5.94711 0.146447 5.85334C0.0526785 5.75958 0 5.6324 0 5.49979C0 5.36718 0.0526785 5.24 0.146447 5.14624C0.240215 5.05247 0.367392 4.99979 0.5 4.99979H10.2931L6.64625 1.35354C6.55243 1.25972 6.49972 1.13247 6.49972 0.99979C6.49972 0.867108 6.55243 0.73986 6.64625 0.64604C6.74007 0.552219 6.86732 0.499512 7 0.499512C7.13268 0.499512 7.25993 0.552219 7.35375 0.64604L11.8538 5.14604C11.9002 5.19248 11.9371 5.24762 11.9623 5.30832C11.9874 5.36902 12.0004 5.43408 12.0004 5.49979C12.0004 5.5655 11.9874 5.63056 11.9623 5.69126C11.9371 5.75196 11.9002 5.8071 11.8538 5.85354Z"
                  className="fill-primary"
                />
              </svg>
            </Button>
          </div>

          <div className="h-[300px] overflow-hidden px-6 md:h-[342px] md:px-8">
            <div className="grid size-full grid-cols-2 rounded-t-2xl border border-b-0 border-[#DBEEED] bg-white">
              <div className="flex flex-col justify-center gap-2 border-r border-[#EFF9F8] p-6">
                <div className="flex w-max items-center gap-2 rounded-2xl border border-[#DBEEED] bg-[#F2FFFE] px-4 py-2 text-primary">
                  <img
                    src={assets.svgs.logoIcon}
                    className="size-[26px]"
                    width={26}
                    height={26}
                    alt=""
                  />
                  <p className="text-base font-bold md:text-xl">$15.67</p>
                </div>
                <p className="text-sm font-light text-muted-foreground md:text-lg">
                  Token
                </p>
              </div>
              <div className="flex flex-col justify-center gap-2 border-b border-[#EFF9F8] p-6">
                <div className="flex w-max items-center gap-2 rounded-2xl border border-[#DBEEED] bg-[#F2FFFE] px-4 py-2 text-primary">
                  <img
                    src={assets.svgs.bookmarkIcon}
                    className="size-[26px]"
                    width={26}
                    height={26}
                    alt=""
                  />
                  <p className="text-base font-bold md:text-xl">300</p>
                </div>
                <p className="text-sm font-light text-muted-foreground md:text-lg">
                  Saved Properties
                </p>
              </div>
              <div className="flex flex-col justify-center gap-2 border-t border-[#EFF9F8] p-6">
                <div className="flex w-max items-center gap-2 rounded-2xl border border-[#DBEEED] bg-[#F2FFFE] px-4 py-2 text-primary">
                  <img
                    src={assets.svgs.homeIcon}
                    className="size-[26px]"
                    width={26}
                    height={26}
                    alt=""
                  />
                  <p className="text-base font-bold md:text-xl">3</p>
                </div>
                <p className="text-sm font-light text-muted-foreground md:text-lg">
                  Properties Owned
                </p>
              </div>
              <div className="flex flex-col justify-center gap-2 border-l border-[#EFF9F8] p-6">
                <div className="flex w-max items-center gap-2 rounded-2xl border border-[#DBEEED] bg-[#F2FFFE] px-4 py-2 text-primary">
                  <img
                    src={assets.svgs.moneyIcon}
                    className="size-[26px]"
                    width={26}
                    height={26}
                    alt=""
                  />
                  <p className="text-base font-bold md:text-xl">10</p>
                </div>
                <p className="text-sm font-light text-muted-foreground md:text-lg">
                  Properties Rented
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2 h-px w-full" />

      <div className="rounded-2xl md:rounded-3xl md:border md:bg-background">
        <ListingBoard />

        {listings.length === 0 ? (
          <div className="mx-auto grid grid-cols-1 gap-4 overflow-y-auto py-6 md:gap-6 md:p-6 lg:grid-cols-2 2xl:grid-cols-3">
            {[...new Array(3)].map((_, _index) => (
              <div key={_index} className="group rounded-[24px] bg-white">
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
            {listings.slice(0, 3)?.map((listing: Listing) => {
              return <ListingCard key={listing.id} listing={listing} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
