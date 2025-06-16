import StepOne from "./steps/step-one";
import StepTwo from "./steps/step-two";
import StepThree from "./steps/step-three";
import StepFour from "./steps/step-four";
import { Form } from "@/components/ui/form";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ONBOARDING_SCHEMA, onboardingSchema } from "@/utils/validators";

export default function OnboardingPage() {
  const walletState = useSelector((state: RootState) => state.onboarding);

  const form = useForm<ONBOARDING_SCHEMA>({
    resolver: zodResolver(onboardingSchema),
  });

  const renderStep = () => {
    switch (walletState.currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      default:
        return null;
    }
  };

  // const dt = {
  //   signature: "address", // <call-signature>
  //   payload: {
  //     entryPoint: "verify", // <function-name>,
  //     contractAddress: "0x1111", //<contract-address>,
  //     calldata: [], // <array of arguments>
  //   },
  // };

  // const message = stringToByteArray({JSON.stringify(<payload>)});
  //   const msgHash = hash.computeHashOnElements(message);
  //   const signature = ec.starkCurve.sign(msgHash, PRIVATE_KEY);

  // const message = stringToByteArray({JSON.stringify(<payload>)}).split(",");
  //   const msgHash = hash.computeHashOnElements(message);
  //   const signature = ec.starkCurve.sign(msgHash, PRIVATE_KEY);

  return (
    <div className="h-full">
      <div className="absolute left-0 top-0 -z-10 min-h-screen w-full bg-gradient-to-b from-[#FFF4DE] via-[#FFF4DE]/50 to-background" />
      <Form {...form}>
        <AnimatePresence mode="wait" custom={walletState.currentStep}>
          <motion.div
            key={walletState.currentStep}
            custom={walletState.currentStep}
            className="flex h-full w-full flex-col gap-4"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </Form>
    </div>
  );
}
