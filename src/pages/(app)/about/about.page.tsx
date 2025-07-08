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

        <div className="rounded-2xl md:rounded-3xl md:border md:bg-background"></div>
      </div>
    </React.Fragment>
  );
}
