import { AppDispatch, RootState } from "@/store";
import { setCurrentStep, updateFormData } from "@/store/slice/onboarding.slice";
import { ONBOARDING_SCHEMA, onboardingSchema } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";

const types = [
  {
    label: "Individual",
    sub: "List, buy, or rent properties. Perfect for sellers, landlords, buyers, and renters.",
    path: "property-management",
    img: "/agent.webp",
    isAvailable: true,
  },
  {
    label: "Entity",
    sub: "Join our DAO to verify listings and influence platform decisions.",
    path: "property-management",
    img: "/dao.webp",
    isAvailable: true,
  },
  {
    label: "Trading Account",
    sub: "Trade tokenized real estate assets and invest in the future of real estate.",
    path: "trading",
    img: "/trading.webp",
    isAvailable: false,
  },
];

export default function AccountType() {
  const dispatch = useDispatch<AppDispatch>();
  const formState = useSelector((state: RootState) => state.onboarding);

  const { handleSubmit } = useForm({
    resolver: zodResolver(
      onboardingSchema.pick({
        pass: true,
      }),
    ),
    defaultValues: {
      ...formState.formData,
    },
  });

  const onSubmit = (data: Partial<ONBOARDING_SCHEMA>) => {
    dispatch(updateFormData(data));
    dispatch(setCurrentStep(6));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full bg-background"
    >
      <motion.div
        variants={{
          enter: (currentStep: number) => ({
            x: currentStep > 0 ? -100 : 100,
            opacity: 0,
          }),
          center: {
            x: 0, // Centered position
            opacity: 1,
          },
          exit: (currentStep: number) => ({
            x: currentStep > 0 ? 100 : -100,
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
        className="flex w-full items-center justify-center p-6 lg:max-w-[55%]"
      >
        <div className="flex w-full max-w-[480px] flex-col gap-[32px]">
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold text-primary sm:text-4xl">
              Choose Your Account Type
            </p>
            <p className="text-lg font-normal text-muted-foreground">
              Select an option that best suits your needs.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {types.map((type) => (
              <Link
                to={`/onboarding/${type.path}`}
                state={{ type: type.label }}
                key={type.sub}
                className={cn(
                  "relative flex items-center gap-4 rounded-xl border bg-secondary p-6",
                  {
                    "pointer-events-none cursor-not-allowed opacity-40":
                      !type.isAvailable,
                  },
                )}
              >
                {!type.isAvailable && (
                  <span className="absolute left-0 top-0 h-full w-full rounded-[inherit]" />
                )}
                <div className="flex h-[118px] flex-1 flex-col justify-between">
                  <p className="text-lg font-medium">{type.label}</p>
                  <p className="text-sm font-normal leading-[20.8px] text-muted-foreground sm:text-base">
                    {type.sub}
                  </p>

                  <p className="flex w-max items-center gap-2 font-medium text-primary">
                    {type.isAvailable ? (
                      <>
                        <span>Start Onboarding</span>
                        <ArrowRight className="size-4" />
                      </>
                    ) : (
                      <span>Coming Soon</span>
                    )}
                  </p>
                </div>

                <div className="size-[100px] overflow-hidden rounded-lg border bg-secondary">
                  <img
                    src={type.img}
                    alt={type.label}
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                </div>
              </Link>
            ))}

            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => {
                  dispatch(setCurrentStep(formState.currentStep - 1))

                }}
                variant={"outline"}
                size={"lg"}
                className="rounded-full"
              >
                Back
              </Button>

              {/* <Button type="submit" className="w-48 rounded-full" size={"lg"}>
                <span>Next</span>
                <TiArrowRightOutline className="size-5" />
              </Button> */}
            </div>
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
        className="hidden w-full max-w-[45%] items-center p-4 lg:flex"
      >
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-[rgb(31,74,69)]">
          <video
            src={assets.video.coitonVideo}
            autoPlay
            loop
            muted
            aria-readonly={true}
            className="pointer-events-none w-full select-none"
          />
        </div>
      </motion.div>
    </form>
  );
}
