import Gateway from "./steps/gateway";
import WalletConnect from "./steps/wallet-connect";
import { Form } from "@/components/ui/form";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ONBOARDING_SCHEMA, onboardingSchema } from "@/utils/validators";
import Management from "./steps/management";
import AccountType from "./steps/account-type";

export default function OnboardingPage() {
  const walletState = useSelector((state: RootState) => state.onboarding);

  const form = useForm<ONBOARDING_SCHEMA>({
    resolver: zodResolver(onboardingSchema),
  });

  const renderStep = () => {
    switch (walletState.currentStep) {
      case 1:
        return <Gateway />;
      case 2:
        return <WalletConnect />;
      case 3:
        return <Management />;
      case 4:
        return <AccountType />;
      default:
        return null;
    }
  };

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
