import { useInView, motion, useMotionValue, useTransform } from "framer-motion";
import {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import MaxWrapper from "@/components/shared/max-wrapper";
import { feedbacks, variants } from "@/utils/constants";
import { cn } from "@/lib/utils";

declare type CLIENTS_FEEDBACK = {
  id: number;
  feedback: string;
  name: string;
  position: string;
  image?: string;
};

const Review: FC = () => {
  const { fadeIn } = variants;

  const [allReviews, setAllReviews] = useState<CLIENTS_FEEDBACK[]>(feedbacks);

  const reviewRef = useRef(null);

  const isInView = useInView(reviewRef, { margin: "0px 0px -60% 0px" });

  return (
    <MaxWrapper>
      <div
        className="mb-32 flex flex-col gap-5 sm:gap-10 md:gap-20 lg:gap-32"
        ref={reviewRef}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <motion.h2
              variants={fadeIn("right", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{
                once: true,
                amount: 0.7,
              }}
              className="font-normal leading-[80px] text-primary"
            >
              What Our Users Say
            </motion.h2>
          </div>
        </div>

        <div className="mx-auto hidden gap-6 sm:gap-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {feedbacks.map((rv: CLIENTS_FEEDBACK, _key: number) => (
            <motion.div
              key={_key}
              className={cn(
                "mx-auto h-[400px] w-[calc(100%-10%)] cursor-pointer rounded-3xl border-2 border-[#C4C0C0] bg-background shadow-2xl shadow-black/20 transition-all duration-500 ease-in-out sm:mx-0 sm:h-[416.83px] sm:w-[344.38px] [&:nth-child(1)]:z-[1] [&:nth-child(1)]:translate-x-16 [&:nth-child(1)]:translate-y-0 [&:nth-child(1)]:rotate-0 lg:[&:nth-child(1)]:translate-x-[250px] lg:[&:nth-child(1)]:translate-y-12 lg:[&:nth-child(1)]:rotate-[5deg] [&:nth-child(2)]:z-[0] [&:nth-child(2)]:-translate-x-16 lg:[&:nth-child(2)]:translate-x-[100px] [&:nth-child(3)]:z-[0] [&:nth-child(3)]:translate-x-16 [&:nth-child(3)]:translate-y-8 [&:nth-child(3)]:-rotate-0 lg:[&:nth-child(3)]:-translate-x-[50px] lg:[&:nth-child(3)]:-rotate-[3deg] [&:nth-child(4)]:z-[1] [&:nth-child(4)]:-translate-x-16 [&:nth-child(4)]:translate-y-8 [&:nth-child(4)]:-rotate-0 lg:[&:nth-child(4)]:-translate-x-[250px] lg:[&:nth-child(4)]:translate-y-16 lg:[&:nth-child(4)]:-rotate-[7deg]",
                {
                  "[&:nth-child(1)]:translate-x-0 [&:nth-child(1)]:translate-y-0 [&:nth-child(1)]:-rotate-0 md:[&:nth-child(1)]:translate-x-3 md:[&:nth-child(1)]:translate-y-5 md:[&:nth-child(1)]:-rotate-6 lg:[&:nth-child(1)]:translate-x-[30px] lg:[&:nth-child(1)]:translate-y-[40px] lg:[&:nth-child(1)]:-rotate-[8.76deg] [&:nth-child(2)]:translate-x-0 [&:nth-child(2)]:translate-y-0 [&:nth-child(2)]:rotate-0 md:[&:nth-child(2)]:translate-x-[8px] md:[&:nth-child(2)]:translate-y-5 md:[&:nth-child(2)]:rotate-[4.39deg] lg:[&:nth-child(2)]:-translate-y-[5px] lg:[&:nth-child(2)]:translate-x-[10px] lg:[&:nth-child(2)]:-rotate-[2.39deg] [&:nth-child(3)]:translate-x-0 [&:nth-child(3)]:translate-y-0 [&:nth-child(3)]:rotate-0 md:[&:nth-child(3)]:translate-x-[10px] md:[&:nth-child(3)]:translate-y-5 md:[&:nth-child(3)]:rotate-[4deg] lg:[&:nth-child(3)]:-translate-x-[10px] lg:[&:nth-child(3)]:translate-y-[10px] lg:[&:nth-child(3)]:rotate-[3.17deg] [&:nth-child(4)]:translate-x-0 [&:nth-child(4)]:translate-y-0 [&:nth-child(4)]:rotate-0 md:[&:nth-child(4)]:-translate-x-[10px] md:[&:nth-child(4)]:translate-y-5 md:[&:nth-child(4)]:-rotate-[10.4deg] lg:[&:nth-child(4)]:-translate-x-[30px] lg:[&:nth-child(4)]:translate-y-[60px] lg:[&:nth-child(4)]:rotate-[10.4deg]":
                    isInView,
                },
              )}
            >
              <div className="flex size-full flex-col justify-between rounded-[inherit] p-10">
                <div className="relative size-[116px] rounded-full bg-secondary">
                  <img
                    src={rv.image!}
                    alt={rv.name}
                    className="size-full object-contain"
                  />
                </div>

                <p className="line-clamp-6 text-base font-medium">
                  “{rv.feedback}”
                </p>

                <div className="ml-auto flex flex-col items-end">
                  <p className="text-base font-medium">{rv.name}</p>
                  <span className="text-sm text-muted-foreground">
                    {rv.position}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid place-items-center md:hidden">
          {allReviews.map((rv) => (
            <MobileReviewCard
              key={rv.id}
              singleRv={rv}
              id={rv.id}
              allReviews={allReviews}
              setAllReviews={setAllReviews}
            />
          ))}
        </div>
      </div>
    </MaxWrapper>
  );
};
export default memo(Review);

const MobileReviewCard = ({
  id,
  singleRv,
  allReviews,
  setAllReviews,
}: {
  id: number;
  singleRv: CLIENTS_FEEDBACK;
  allReviews: CLIENTS_FEEDBACK[];
  setAllReviews: Dispatch<SetStateAction<CLIENTS_FEEDBACK[]>>;
}) => {
  const [currentIndex, setCurrentIndex] = useState(allReviews.length - 1);
  const [originalReviews] = useState([...allReviews]);
  const x = useMotionValue(0);

  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);

  const isFront = id === allReviews[currentIndex]?.id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 5 : -5;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 20) {
      setAllReviews((prev: CLIENTS_FEEDBACK[]) => {
        const newReviews = prev.filter((review) => review.id !== id);
        if (newReviews.length === 0) {
          // If all cards are removed, reset to the original set
          return [...originalReviews];
        }
        return newReviews;
      });
      x.set(0);
    }
  };

  useEffect(() => {
    setCurrentIndex(allReviews.length - 1);
  }, [allReviews]);

  return (
    <motion.div
      className="flex h-[400px] w-[330px] origin-bottom items-center justify-center rounded-3xl border-2 border-gray-900 bg-background hover:cursor-grab active:cursor-grabbing md:h-[430px] md:w-[350px]"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 20px 25px -5px rgba(0 0 0 / 0.2), 0 8px 10px -6px rgba(0 0 0 / 0.2)"
          : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag="x"
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="flex size-full flex-col justify-between rounded-[inherit] px-10 py-8 md:p-10">
        <div className="relative size-[116px] rounded-full bg-secondary">
          <img
            src={singleRv.image!}
            alt={singleRv.name}
            className="size-full object-contain"
          />
        </div>

        <p className="line-clamp-6 text-base font-medium">
          “{singleRv.feedback}”
        </p>

        <div className="ml-auto flex flex-col items-end">
          <p className="text-base font-medium">{singleRv.name}</p>
          <span className="text-sm text-muted-foreground">
            {singleRv.position}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
