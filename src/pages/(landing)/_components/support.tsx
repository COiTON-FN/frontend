import { FC, memo } from "react";
import { motion } from "framer-motion";

import { variants } from "@/utils/constants";
import MaxWrapper from "@/components/shared/max-wrapper";
import { assets } from "@/assets";
import { X } from "lucide-react";

const Support: FC = () => {
  const { fadeIn } = variants;

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      translateY: -10,
      zIndex: 2,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 2,
    },
  };

  return (
    <MaxWrapper>
      <div className="mg:gap-14 mb-28 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 md:gap-6 lg:w-[458px]">
          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{
              once: true,
              amount: 0.7,
            }}
            className="flex items-center gap-4"
          >
            <div className="flex h-[38px] flex-1 items-center justify-center rounded-full border border-primary text-sm font-normal text-primary sm:w-44 sm:flex-none md:w-[248px] md:text-base md:font-medium">
              Starknet-Backed
            </div>

            <div className="flex items-center gap-1 text-primary">
              <img
                src={assets.svgs.logoIcon}
                alt="coiton"
                width={34}
                height={34}
                className="size-9 object-contain"
              />
              <X size={12} />
              <img
                src={assets.svgs.starknetIcon}
                alt="starknet"
                width={34}
                height={34}
                className="size-9 object-contain"
              />
            </div>
          </motion.div>
          <motion.h1
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{
              once: true,
              amount: 0.7,
            }}
            className="font-normal text-primary"
          >
            Decentralized <br className="hidden md:flex lg:hidden" />{" "}
            Real-Estate Tokenization
          </motion.h1>
        </div>
        <motion.div
          variants={fadeIn("left", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{
            once: true,
            amount: 0.7,
          }}
          className="h-[280px] w-full rounded-2xl bg-gradient-to-br from-[#FBFEFE] via-[#FBFEFE] to-[#57E741] p-1 sm:h-[400px] md:rounded-[24px] lg:w-[857px] lg:p-[1.5px]"
        >
          <div className="relative flex size-full !max-w-full justify-center overflow-clip rounded-[inherit] bg-white bg-gradient-to-b from-[#F9FFF8] to-[#DEFED9]">
            <motion.div
              className="absolute -left-5 z-[2] h-[350px] w-[200px] cursor-pointer sm:-left-5 sm:top-16 sm:h-[400px] sm:w-[300px] md:left-5 md:top-12 md:h-[400px] md:w-[330px]"
              style={{
                rotate: "-3.53deg",
              }}
              whileHover="whileHover"
              whileTap="whileTap"
              variants={imageVariants}
            >
              <img
                src={assets.images.prop1}
                alt="PROPERTY 1"
                width={297}
                height={359}
                loading="lazy"
                className="size-full rounded-lg object-contain sm:-ml-4 lg:-ml-0"
              />
            </motion.div>

            <motion.div
              className="absolute left-auto right-auto z-[1] h-[350px] w-[200px] cursor-pointer sm:top-16 sm:h-[400px] sm:w-[300px] md:top-8 md:h-[400px] md:w-[330px]"
              style={{
                rotate: "0.23deg",
              }}
              whileHover="whileHover"
              whileTap="whileTap"
              variants={imageVariants}
            >
              <img
                src={assets.images.prop2}
                alt="PROPERTY 2"
                width={297}
                height={359}
                loading="lazy"
                className="size-full rounded-lg object-contain"
              />
            </motion.div>

            <motion.div
              className="absolute right-0 z-0 h-[350px] w-[200px] cursor-pointer sm:-right-5 sm:top-16 sm:h-[400px] sm:w-[300px] md:right-0 md:top-12 md:h-[400px] md:w-[330px]"
              style={{
                rotate: "2.94deg",
              }}
              whileHover="whileHover"
              whileTap="whileTap"
              variants={imageVariants}
            >
              <img
                src={assets.images.prop3}
                alt="PROPERTY 3"
                width={297}
                height={359}
                loading="lazy"
                className="size-full rounded-lg object-contain"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </MaxWrapper>
  );
};

export default memo(Support);
