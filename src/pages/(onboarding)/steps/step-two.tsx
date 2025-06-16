import { memo, useEffect } from "react";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { ONBOARDING_SCHEMA, onboardingSchema } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setCurrentStep, updateFormData } from "@/store/slice/onboarding.slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiArrowRightOutline } from "react-icons/ti";
import { RiShieldCheckFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useWalletHook } from "@/hooks/useWallet.hook";

const StepTwo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const formState = useSelector((state: RootState) => state.onboarding);
  const walletState = useSelector((state: RootState) => state.wallet);
  const { handleConnectWallet } = useWalletHook();

  const { handleSubmit } = useForm({
    resolver: zodResolver(
      onboardingSchema.pick({
        address: true,
      }),
    ),
    defaultValues: {
      ...formState.formData,
      address: "",
    },
  });

  const onSubmit = (data: Partial<ONBOARDING_SCHEMA>) => {
    dispatch(updateFormData(data));
    dispatch(setCurrentStep(3));
  };

  useEffect(() => {
    if (walletState.isWalletConnected) {
      dispatch(setCurrentStep(3));
    }
  }, [
    walletState.isWalletConnected,
    formState.currentStep,
    walletState.walletAddress,
    walletState.isWalletConnected,
  ]);

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
        <div className="flex h-72 w-full items-center justify-center rounded-t-[32px] bg-[#F1FEEE] py-10 sm:h-[339px]">
          <img
            src={assets.svgs.stepTwo}
            alt="STEP TWO"
            loading="lazy"
            className="size-full"
          />
        </div>
        <div className="flex flex-col gap-4 p-7 md:gap-6 md:p-10">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
              Connect Your Wallet
            </p>
            <p className="text-base text-muted-foreground sm:text-lg">
              Secure your transactions with your crypto wallet.
            </p>
          </div>

          <div className="mx-auto flex max-w-xl flex-col gap-4">
            <div className="flex items-start gap-2">
              <RiShieldCheckFill className="size-5 text-primary md:size-6" />
              <p className="-mt-px flex-1 text-sm font-normal leading-6 text-muted-foreground sm:text-base sm:leading-normal">
                Please connect your wallet to proceed. Supported wallets include
                Argent, Bravvos, Family and others.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={async () => {
              await handleConnectWallet();
            }}
            className="w-max gap-2 rounded-full px-6"
          >
            <span>Connect Wallet</span>
            <TiArrowRightOutline className="size-5" />
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default memo(StepTwo);
