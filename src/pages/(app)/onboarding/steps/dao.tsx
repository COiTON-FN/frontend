import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/store";
import { setCurrentStep, updateFormData } from "@/store/slice/onboarding.slice";
import { ONBOARDING_SCHEMA, onboardingSchema } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TiArrowRightOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function Dao() {
  const dispatch = useDispatch<AppDispatch>();
  const formState = useSelector((state: RootState) => state.onboarding);

  const { handleSubmit } = useForm({
    resolver: zodResolver(
      onboardingSchema.pick({
        pass: true,
      })
    ),
    defaultValues: {
      ...formState.formData,
    },
  });

  const onSubmit = (data: Partial<ONBOARDING_SCHEMA>) => {
    dispatch(updateFormData(data));
    dispatch(setCurrentStep(5));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full bg-background"
    >
      <motion.div
        variants={{
          enter: (currentStep: number) => ({
            x: currentStep > 0 ? -100 : 100, // Enter from left if moving forward, right if going back
            opacity: 0,
          }),
          center: {
            x: 0, // Centered position
            opacity: 1,
          },
          exit: (currentStep: number) => ({
            x: currentStep > 0 ? 100 : -100, // Exit to right if moving forward, left if going back
            opacity: 0,
          }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { duration: 0.5, ease: "linear" },
          opacity: { duration: 0.5, ease: "linear" },
        }}
        className="flex lg:max-w-[55%] w-full items-center justify-center p-6"
      >
        <div className="flex w-full max-w-[480px] flex-col gap-[32px]">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-3xl sm:text-4xl text-primary">
              Become a DAO
            </p>
            <p className="font-normal text-lg text-muted-foreground">
              Join our DAO to verify listings and influence platform decisions
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={() => dispatch(setCurrentStep(3))}
              variant={"outline"}
              size={"lg"}
              className="rounded-full"
            >
              Back
            </Button>

            <Button type="submit" className="w-48 rounded-full" size={"lg"}>
              <span>Next</span>
              <TiArrowRightOutline className="size-5" />
            </Button>
          </div>
        </div>
      </motion.div>
      <motion.div
        variants={{
          enter: (currentStep: number) => ({
            x: currentStep > 0 ? 100 : -100, // Enter from right if moving forward, left if going back
            opacity: 0,
          }),
          center: {
            x: 0, // Centered position
            opacity: 1,
          },
          exit: (currentStep: number) => ({
            x: currentStep > 0 ? -100 : 100, // Exit to left if moving forward, right if going back
            opacity: 0,
          }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { duration: 0.5, ease: "linear" },
          opacity: { duration: 0.5, ease: "linear" },
        }}
        className="hidden lg:flex max-w-[45%] w-full items-center p-4"
      >
        <div className="h-full w-full rounded-2xl overflow-hidden bg-primary">
          <img
            src={assets.svgs.stepFive}
            alt="STEP FOUR"
            className="h-full w-full"
          />
        </div>
      </motion.div>
    </form>
  );
}
