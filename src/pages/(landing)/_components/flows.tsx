import {
  memo,
  FC,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useInView, motion } from "framer-motion";

import MaxWrapper from "@/components/shared/max-wrapper";
import { assets } from "@/assets";
import { cn } from "@/lib/utils";
import { variants } from "@/utils/constants";

declare interface COITON_FLOW {
  children: ReactNode;
  className?: string;
  title: string;
  description: string;
  styles: {
    gradient: string;
    color: string;
    border: string;
  };
}

const coitonFlows: COITON_FLOW[] = [
  {
    title: "Browse Properties",
    description:
      "Explore a curated list of high-quality real estate opportunities.",
    styles: {
      gradient: "from-[#BEB5FF] via-[#391DFC] to-[#391DFC]",
      color: "text-[#391DFC]",
      border: "bg-[#BEB5FF] border-[#391DFC]",
    },
    children: (
      <div className="relative aspect-[1.5] h-auto w-full overflow-hidden lg:h-[396px]">
        <video
          loop
          autoPlay
          muted
          width={120}
          height={396}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-full -translate-x-1/2 -translate-y-1/2 scale-[1.95] select-none lg:scale-[2.25]"
          src={assets.lottie.stackLottie}
        />
      </div>
    ),
  },
  {
    title: "Buy Tokens",
    description:
      "Purchase fractional ownership in properties by buying tokens backed by real assets.",
    styles: {
      gradient: "from-[#7ad3fa] via-[#1A8FC1] to-[#1A8FC1]",
      color: "text-[#1A8FC1]",
      border: "bg-[#7ad3fa] border-[#1A8FC1]",
    },
    children: (
      <div className="relative aspect-[1.5] h-auto w-full overflow-hidden lg:h-[397px]">
        <img
          src={assets.svgs.buyToken}
          alt="BUY TOKEN"
          className="size-full object-contain"
          loading="lazy"
        />
      </div>
    ),
  },
  {
    title: "Earn Returns",
    description:
      "Benefit from rental income and potential property appreciation, directly through your tokens.",
    styles: {
      gradient: "from-[#a0f36d] via-[#59C11A] to-[#59C11A]",
      color: "text-[#59C11A]",
      border: "bg-[#a0f36d] border-[#59C11A]",
    },
    children: (
      <div className="relative aspect-[1.7] h-auto w-full overflow-hidden lg:h-[400px]">
        <img
          src={assets.svgs.earnReward}
          alt="EARN REWARD"
          className="ml-2 size-full scale-[1.21] object-contain md:ml-4"
          loading="lazy"
        />
      </div>
    ),
  },
];

const Flows: FC = () => {
  const [activeFlow, setActiveFlow] = useState(coitonFlows[0]);

  return (
    <div className="mb-28">
      <MaxWrapper className="flex gap-7 lg:hidden">
        <div className="flex flex-1 flex-col gap-10 md:gap-16 lg:gap-32">
          {coitonFlows.map((flow, index) => (
            <div key={index} className="flex flex-col gap-4 md:gap-2 lg:gap-10">
              <div
                className={cn(
                  "w-full rounded-3xl p-px md:bg-gradient-to-br lg:mt-36 lg:last:mb-24",
                  flow.styles.gradient,
                )}
              >
                <div
                  className={cn(
                    "flex size-full flex-col gap-3 rounded-[inherit] bg-background pl-8 md:p-8 md:pl-16 lg:gap-6 lg:p-12",
                    flow.styles.color,
                  )}
                >
                  <h2 className="relative font-normal">
                    <span
                      className={cn(
                        "absolute -left-8 top-1/2 size-[10px] -translate-y-1/2 rounded-full border-2",
                        flow.styles.border,
                      )}
                    />
                    {flow.title}
                  </h2>
                  <p className="text-base font-normal md:text-lg lg:text-xl lg:font-light">
                    {flow.description}
                  </p>
                </div>
              </div>

              <div className="flex h-auto w-full flex-col overflow-y-clip lg:h-[396px] lg:max-w-[682px]">
                {flow.children}
              </div>
            </div>
          ))}
        </div>
      </MaxWrapper>
      <MaxWrapper className="hidden gap-[37px] lg:flex">
        {/* Sticky section */}
        <div className="sticky top-32 flex h-[396px] w-full max-w-[682px] flex-col overflow-y-clip rounded-3xl">
          {activeFlow.children}
        </div>

        {/* Scrollable sections */}
        <div className="flex flex-1 flex-col">
          {coitonFlows.map((flow, index) => (
            <FlowCard
              key={index}
              flow={flow}
              index={index}
              setActiveFlow={setActiveFlow}
            />
          ))}
        </div>
      </MaxWrapper>
    </div>
  );
};

export default memo(Flows);

const FlowCard = ({
  flow,
  index,
  setActiveFlow,
}: {
  flow: COITON_FLOW;
  index: number;
  setActiveFlow: Dispatch<SetStateAction<COITON_FLOW>>;
}) => {
  const { fadeIn } = variants;

  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "75% 0px -75% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveFlow(flow);
    }
  }, [isInView, setActiveFlow, flow]);

  return (
    <motion.div
      ref={ref}
      variants={fadeIn("left", 0.3 * index)}
      initial="hidden"
      whileInView={"show"}
      viewport={{
        once: false,
        amount: 0.8,
      }}
      custom={index}
      key={index}
      className={cn(
        "mt-36 w-full rounded-3xl bg-gradient-to-br p-px last:mb-20",
        flow.styles.gradient,
      )}
    >
      <div
        className={cn(
          "flex size-full flex-col gap-6 rounded-[inherit] bg-background p-12 pl-16",
          flow.styles.color,
        )}
      >
        <h2 className="relative font-normal">
          <span
            className={cn(
              "absolute -left-8 top-1/2 size-[10px] -translate-y-1/2 rounded-full border-2",
              flow.styles.border,
            )}
          />
          {flow.title}
        </h2>
        <p className="text-xl font-light">{flow.description}</p>
      </div>
    </motion.div>
  );
};
