import * as React from "react";
import { motion } from "framer-motion";

import { assets } from "@/assets";
import { variants } from "@/utils/constants";
import { SEO } from "@/components/shared/seo";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  const { fadeIn } = variants;

  return (
    <React.Fragment>
      <SEO page="about" />

      <div className="flex flex-col gap-4 py-4">
        <div className="h-[200px] w-full overflow-hidden rounded-2xl bg-gradient-to-l from-[#0D857C] to-[#0EB9AC] p-[1px] sm:h-[240px] md:rounded-3xl">
          <div className="flex size-full overflow-hidden rounded-[inherit] bg-gradient-to-r from-[#056F67] to-[#0AADA1] text-white">
            <div className="lg:px-12">
              <div className="mx-auto size-full border-[#0FAB9F] lg:border-x">
                <div className="flex size-full items-center justify-center">
                  <div className="flex w-full flex-col gap-1 border-y border-[#0FAB9F] px-6 py-4 lg:p-4">
                    <h4 className="text-2xl font-normal italic tracking-wider sm:text-3xl">
                      Our mission to democratize real estate.
                    </h4>
                    <span className="text-base font-light text-[#B1EDE9] lg:text-xl">
                      Collaborative On-chain Investment and Trading of
                      Neighborhoods
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden h-full flex-1 xl:flex">
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
                src={assets.shapes.clyShape}
                className="absolute -right-56 -top-4 hidden sm:flex md:hidden lg:flex xl:-right-24"
              />
            </div>
          </div>
        </div>

        <Separator className="my-2 h-px w-full" />

        <div className="space-y-6 rounded-2xl pb-6 sm:space-y-8 sm:px-8 sm:py-6 md:rounded-3xl md:border md:bg-background md:px-10 md:py-10 lg:space-y-12">
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 xl:flex-row xl:gap-10">
            <div className="hidden max-w-sm flex-1 sm:flex">
              <p className="text-base font-medium text-primary">About Us</p>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <p className="text-2xl font-light leading-[1.4] sm:text-3xl sm:leading-[1.4] md:text-2xl md:leading-[1.3] lg:text-3xl lg:leading-[1.3]">
                <span className="font-normal text-primary">
                  We're more than just a Real-Estate Platform.
                </span>{" "}
                We're a <i>Decentralized Real-Estate Trading Platform</i>{" "}
                designed to tokenize real estate properties using a secure smart
                contract system.
              </p>

              <p className="max-w-3xl text-base font-normal opacity-60">
                Coiton maintains the integrity of its asset pools by ensuring
                that the total value of tokenized properties remains consistent
                across all transactions. Coiton has an automated protocol that
                incorporates low transaction fees. This architecture ensures
                liquidity, security, and efficiency for real estate traders
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 xl:flex-row xl:gap-10">
            <div className="w-full overflow-hidden rounded-2xl bg-gradient-to-l from-[#0D857C] to-[#0EB9AC] p-[1px] md:rounded-3xl xl:max-w-sm">
              <div className="flex w-full flex-1 flex-col gap-2 overflow-hidden rounded-[inherit] bg-primary bg-gradient-to-br from-[#056F67] to-[#0AADA1] p-6 text-white">
                <p className="text-2xl font-light sm:text-3xl md:text-2xl lg:text-3xl">
                  Our mission is clear
                </p>

                <p className="text-base font-light text-[#B1EDE9]">
                  To democratize real estate investing by utilizing blockchain
                  technology to provide a safe, open, and welcoming marketplace.
                </p>

                <div className="mx-auto mt-8">
                  <img
                    src="/mission.avif"
                    alt="Grow"
                    width={300}
                    height={205}
                    className="object-contain"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-secondary p-6 dark:bg-neutral-900 md:rounded-3xl">
              <p className="text-2xl font-light sm:text-3xl md:text-2xl lg:text-3xl">
                Our impact knows no bounds
              </p>
              <p className="mb-8 text-base font-light">
                From integrating blockchain technology to real-time, borderless
                transactions
              </p>

              <div className="m-auto">
                <img
                  src="/dot-map.png"
                  alt="map"
                  width={640}
                  height={300}
                  loading="eager"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
