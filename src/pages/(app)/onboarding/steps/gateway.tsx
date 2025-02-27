import { memo } from "react";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { ONBOARDING_SCHEMA, onboardingSchema } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/store";
import { setCurrentStep, updateFormData } from "@/store/slice/onboarding.slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiArrowRightOutline } from "react-icons/ti";
import { RiShieldCheckFill } from "react-icons/ri";

const Gateway = () => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.onboarding.formData);

  const { handleSubmit } = useForm({
    resolver: zodResolver(
      onboardingSchema.pick({
        pass: true,
      })
    ),
    defaultValues: formData,
  });

  const onSubmit = (data: Partial<ONBOARDING_SCHEMA>) => {
    dispatch(updateFormData(data));
    dispatch(setCurrentStep(2));
  };

  return (
    <motion.form
      variants={{
        enter: (currentStep: number) => ({
          x: currentStep > 0 ? 50 : -50,
          opacity: 0, // Start with opacity 0 for fade-in effect
        }),
        center: {
          x: 0,
          opacity: 1, // Fully visible when centered
        },
        exit: (currentStep: number) => ({
          x: currentStep < 0 ? 50 : -50,
          opacity: 0, // Fade-out effect
        }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { duration: 0.5, ease: "linear" }, // Transition for the position
        opacity: { duration: 0.5, ease: "linear" }, // Transition for the opacity
      }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full items-center justify-center px-5 md:px-6"
    >
      <div className="w-full max-w-[720px] rounded-[32px] bg-background">
        <div className="flex h-72 py-6 sm:py-0 w-full items-center justify-center rounded-t-[32px] bg-[#EEFEFB] sm:h-[339px]">
          <img
            src={assets.svgs.stepOne}
            alt="STEP ONE"
            loading="lazy"
            className="size-full"
          />
        </div>
        <div className="flex flex-col gap-4 md:gap-6 p-7 md:p-10">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-xl sm:text-2xl text-primary md:text-3xl">
              Your Gateway to Decentralized Real Estate.
            </p>
          </div>

          <div className="mx-auto flex max-w-xl flex-col gap-4">
            <div className="flex items-start gap-2">
              <RiShieldCheckFill className="size-5 md:size-6 text-primary" />
              <p className="flex-1 font-normal -mt-px text-sm leading-6 sm:leading-normal sm:text-base text-muted-foreground">
                Join a community that empowers you to manage, verify, and trade
                real estate assets like never before.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <RiShieldCheckFill className="size-5 md:size-6 text-primary" />
              <p className="flex-1 font-normal -mt-px text-sm leading-6 sm:leading-normal sm:text-base text-muted-foreground">
                Explore three unique account types: Property Management, DAO
                Participation, and Trading. Let’s get started!
              </p>
            </div>
          </div>

          <Button type="submit" className="gap-2 w-max rounded-full px-6">
            <span>Start Onboarding</span>
            <TiArrowRightOutline className="size-5" />
          </Button>
        </div>
      </div>
    </motion.form>
  );
};
export default memo(Gateway);
