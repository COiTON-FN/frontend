import { FC, memo, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { X } from "lucide-react";
import { IoMdArrowForward, IoMdCopy } from "react-icons/io";

import { assets } from "@/assets";
import MaxWrapper from "@/components/shared/max-wrapper";
import { variants } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Bento: FC = () => {
  const { fadeIn } = variants;
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const clyTranslateY = useTransform(scrollYProgress, [1, 0], [-50, 50]);
  const clyTranslateX = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const octTranslateY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const octTranslateX = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const flatTranslateY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const flatTranslateX = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <div className="flex-1">
      <MaxWrapper>
        <section className="flex w-full flex-col gap-6" ref={sectionRef}>
          <div className="flex flex-col gap-6 lg:flex-row">
            <motion.div
              variants={fadeIn("right", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
                amount: 0.7,
              }}
              className="aspect-[1.3] rounded-2xl bg-gradient-to-bl from-[#33FFEE] to-primary p-px text-primary md:aspect-[1.8] md:rounded-[24px] lg:aspect-auto lg:h-[500px] lg:flex-1"
            >
              <div className="relative flex size-full flex-col justify-between gap-6 overflow-hidden rounded-[inherit] bg-[#F2FFFE] p-6 dark:bg-neutral-950 md:px-10 md:py-12 lg:gap-0 lg:px-12 lg:py-16">
                <h2 className="text-[40px] font-normal leading-[50px] md:max-w-[514px] md:text-5xl lg:text-[64px] lg:leading-[80px]">
                  Ready to Start Your Real Estate Journey?
                </h2>

                <Button size={"lg"} className="w-max rounded-full">
                  <span>Get Started</span>{" "}
                  <IoMdArrowForward size={20} className="ml-3" />
                </Button>

                <motion.div
                  className="absolute -right-32 top-12 md:-right-[320px] lg:-right-[150px] lg:top-[100px]"
                  style={{
                    translateX: clyTranslateY,
                    translateY: clyTranslateX,
                  }}
                >
                  <motion.div
                    className="rotate-[40deg]"
                    animate={{
                      rotate: 10,
                      translateY: [-10, 10],
                      translateX: [-10, 10],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 7,
                      ease: "easeInOut",
                    }}
                  >
                    <img
                      src={assets.shapes.clyShape}
                      alt="CYLINDER SHAPE"
                      width={641}
                      height={627}
                      className="h-80 w-80 brightness-90 md:size-auto md:!h-[627px] md:!w-[641px]"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn("left", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
                amount: 0.7,
              }}
              className="aspect-[1.3] w-full rounded-2xl bg-gradient-to-bl from-[#FFE692] to-[#B69C46] p-px text-[#9C7800] md:aspect-[1.8] md:rounded-[24px] lg:aspect-auto lg:h-[500px] lg:max-w-md lg:flex-1"
            >
              <div className="relative flex size-full flex-col justify-between overflow-hidden rounded-[inherit] bg-[#FFFCF2] p-6 dark:bg-neutral-950 md:px-10 md:py-12 lg:px-12 lg:py-16">
                <h2 className="text-[40px] font-normal leading-[50px] md:text-5xl lg:text-[64px] lg:leading-[80px]">
                  Dive Deeper into Coiton
                </h2>

                <Link
                  to="https://hooopesteams-organization.gitbook.io/hooopes-team"
                  target="_blank"
                >
                  <Button
                    size={"lg"}
                    className="w-max rounded-full !bg-[#9C7800] hover:!bg-[#9C7800]/90"
                  >
                    <span>View Whitepaper</span>{" "}
                    <IoMdCopy size={22} className="ml-3" />
                  </Button>
                </Link>

                <motion.div
                  className="absolute -right-[170px] top-10 z-0 md:-right-[210px] md:-top-[20px] md:size-[424px] lg:-top-[50px] lg:size-[324px]"
                  style={{
                    translateX: octTranslateY,
                    translateY: octTranslateX,
                  }}
                >
                  <motion.div
                    className="rotate-[35deg]"
                    animate={{
                      rotate: 5,
                      translateY: [5, -5],
                      translateX: [-5, 5],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 7,
                      delay: 3,
                      ease: "easeInOut",
                    }}
                  >
                    <img
                      src={assets.shapes.octYellowShape}
                      alt="OCTERGON SHAPE"
                      className="size-80 brightness-90 md:size-auto"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <motion.div
              variants={fadeIn("right", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
                amount: 0.7,
              }}
              className="aspect-[1.3] rounded-2xl bg-primary p-px text-primary md:aspect-[1.8] md:rounded-[24px] lg:aspect-auto lg:h-[500px] lg:flex-1"
            >
              <div className="relative size-full overflow-hidden rounded-[inherit] bg-[rgb(2,66,60)] dark:bg-neutral-950">
                <video
                  autoPlay
                  loop
                  muted
                  className="pointer-events-none aspect-[1.5] size-full select-none object-cover"
                >
                  <source src={assets.video.coitonVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn("left", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
                amount: 0.7,
              }}
              className="aspect-[1.3] rounded-2xl bg-gradient-to-bl from-[#C0ACFF] to-[#7851F0] p-px text-[#5C41AD] md:rounded-[24px] lg:h-[500px] lg:flex-1"
            >
              <div className="relative flex size-full flex-col justify-between overflow-hidden rounded-[inherit] bg-[#F9F7FF] p-6 dark:bg-neutral-950 md:px-10 md:py-12 lg:px-12 lg:py-16">
                <div className="relative z-[1] flex flex-col gap-3 lg:w-[458px]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-[38px] flex-1 items-center justify-center rounded-full border border-[#5C41AD] text-sm font-normal text-[#5C41AD] sm:w-44 sm:flex-none md:w-[248px] md:text-base md:font-medium">
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
                  </div>
                  <h2 className="text-[40px] font-normal leading-[50px] text-[#5C41AD] md:text-5xl lg:text-[64px] lg:leading-[70px]">
                    Starknet Becomes Coiton Partner
                  </h2>
                </div>

                <div className="absolute -right-0 top-[140px] h-72 w-96 -rotate-[8deg] md:top-[160px] md:h-max md:w-[658.06px] lg:-right-[50px] lg:top-[200px]">
                  <motion.div
                    className="absolute left-0 top-0"
                    style={{
                      rotate: 5,
                      translateX: flatTranslateX,
                      translateY: flatTranslateY,
                    }}
                  >
                    <img
                      src={assets.shapes.flatPurpleShape}
                      alt="FLAT NOODLE SHAPE"
                      className="size-72 w-full brightness-90 md:size-auto"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </MaxWrapper>
    </div>
  );
};

export default memo(Bento);
