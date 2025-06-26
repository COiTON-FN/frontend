import { FC, memo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { IoMdArrowForward } from "react-icons/io";

import MaxWrapper from "@/components/shared/max-wrapper";
import { variants } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { assets } from "@/assets";
import Carousel from "./carousel";

const Banner: FC = () => {
  const { fadeIn } = variants;

  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const translateX = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <div className="flex-1">
      <MaxWrapper>
        <div className="relative flex flex-col items-center gap-4 text-center">
          <>
            <motion.div
              variants={fadeIn("right", 0.7)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
              }}
              animate={{
                rotate: 10,
                translateY: [-10, 10],
                translateX: [-5, 5],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                delay: 3,
                ease: "easeInOut",
              }}
              className="absolute -left-[100px] -top-[10px] -z-10 md:-left-[200px] md:-top-[180px] lg:-left-[200px] lg:-top-[100px]"
            >
              <motion.img
                src={assets.shapes.octShape}
                style={{
                  translateX: translateX,
                  translateY: translateY,
                }}
                alt="OCTAGON SHAPE"
                className="!size-52 rotate-[40deg] brightness-90 md:!h-[310px] md:!w-[324px]"
                width={324}
                height={310}
              />
            </motion.div>
            <motion.div
              className="absolute -right-[130px] top-[200px] -z-10 md:-right-[450px] md:-top-14 lg:-right-[400px] lg:top-[70px]"
              variants={fadeIn("left", 0.7)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
              }}
              animate={{
                rotate: 20,
                translateY: [-15, 15],
                translateX: [-10, 10],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 5,
                delay: 2,
                ease: "easeInOut",
              }}
            >
              <motion.img
                style={{
                  translateX: translateY,
                  translateY: translateX,
                }}
                src={assets.shapes.clyShape}
                alt="CYLINDER SHAPE"
                width={641}
                height={627}
                className="!size-72 rotate-[57deg] brightness-90 md:!h-[627px] md:!w-[641px]"
              />
            </motion.div>
          </>

          <h1 className="font-medium text-primary">
            <motion.span
              variants={fadeIn("up", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
                amount: 0.7,
              }}
            >
              Invest in Real Estate,
            </motion.span>{" "}
            <motion.i
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
                amount: 0.7,
              }}
            >
              Reinvented.
            </motion.i>
          </h1>

          <motion.p
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{
              once: true,
              amount: 0.7,
            }}
            className="text-base font-normal text-primary md:text-[23px] md:leading-9"
          >
            Bringing $2.4 Trillion Real Estate Market On-Chain with Blockchain
            Technology Globally.
          </motion.p>

          <motion.div
            variants={fadeIn("up", 0.5)}
            initial="hidden"
            whileInView={"show"}
            viewport={{
              once: true,
              amount: 0.7,
            }}
          >
            <Link to="/dashboard" className="mt-4 md:mt-6">
              <Button
                className="hidden rounded-full sm:inline-flex"
                size={"lg"}
              >
                <span>Get Started</span>{" "}
                <IoMdArrowForward size={22} className="ml-1" />
              </Button>
              <Button className="inline-flex rounded-full px-6 sm:hidden">
                <span>Get Started</span>{" "}
                <IoMdArrowForward size={22} className="ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="relative mb-16 mt-24 md:mb-28 md:mt-36 lg:mt-56">
          <motion.img
            variants={fadeIn("up", 0.8)}
            initial="hidden"
            whileInView={"show"}
            viewport={{
              once: true,
              amount: 0.7,
            }}
            style={{
              translateX: "-50%",
            }}
            animate={{
              rotate: 5,
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
            className="absolute -top-[140px] left-1/2 -z-10 size-72 w-auto -translate-x-1/2 rotate-3 brightness-90 sm:size-auto md:-top-[270px] md:h-[519px] md:!w-[699px] md:rotate-[5deg]"
            width={699}
            height={519}
          />

          <Carousel />
        </div>
      </MaxWrapper>
    </div>
  );
};

export default memo(Banner);
