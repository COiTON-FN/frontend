import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import React from "react";
import { FiArrowRight } from "react-icons/fi";

const types = [
  {
    label: "Individual",
    sub: "Buy or rent properties with ease. Ideal for home seekers and tenants.",
    path: "individual",
    isAvailable: true,
  },
  {
    label: "Entity",
    sub: "Create and manage property listings as a verified agency, developer, or property manager.",
    path: "entity",
    isAvailable: true,
  },
];

export default function OnboardingPage() {
  const walletState = useSelector((state: RootState) => state.onboarding);

  const navigate = useNavigate();
  const [selectedType, setSelectedType] = React.useState<
    "individual" | "entity" | null
  >(null);

  const handleProceed = (type: "individual" | "entity") => {
    navigate(`/onboarding/${type}`);
  };

  const handleResetType = async () => {
    setSelectedType(null);
  };

  return (
    <div className="h-full">
      <div className="absolute left-0 top-0 -z-10 min-h-screen w-full bg-gradient-to-b from-[#FFF4DE] via-[#FFF4DE]/50 to-background" />

      <AnimatePresence mode="wait" custom={walletState.currentStep}>
        <motion.div
          key={walletState.currentStep}
          custom={walletState.currentStep}
          className="flex h-full w-full flex-col gap-4"
        >
          <div className="flex h-full bg-background">
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
                  {types.map((type) => {
                    const isSelected = selectedType === type.path;

                    return (
                      <div
                        key={type.sub}
                        onClick={() =>
                          setSelectedType(type.path as "individual" | "entity")
                        }
                        className={cn(
                          "group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border p-6 transition-[border] duration-200 md:p-8",
                          isSelected && "border-primary",
                          !type.isAvailable &&
                            "pointer-events-none cursor-not-allowed opacity-40",
                        )}
                      >
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex flex-1 flex-col gap-1">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-lg font-bold text-primary sm:text-xl">
                                {type.label}
                              </p>

                              {isSelected && (
                                <motion.div
                                  className="rounded-full bg-primary/10 p-1.5"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 15,
                                  }}
                                >
                                  <div className="size-3 rounded-full bg-primary" />
                                </motion.div>
                              )}
                            </div>
                            <p className="text-base font-normal !leading-6 text-muted-foreground">
                              {type.sub}
                            </p>

                            <p className="ml-auto mt-3 flex w-max items-center gap-2 font-medium text-primary">
                              {type.isAvailable ? (
                                <>
                                  <span className="text-sm">
                                    Start Onboarding
                                  </span>
                                  <ArrowRight className="size-4" />
                                </>
                              ) : (
                                <span>Coming Soon</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-primary"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        )}
                      </div>
                    );
                  })}

                  <div
                    className={cn(
                      "pointer-events-none mt-4 flex items-center gap-4 opacity-0",
                      {
                        "pointer-events-auto opacity-100": selectedType,
                      },
                    )}
                  >
                    <Button
                      size={"lg"}
                      variant={"outline"}
                      disabled={!selectedType}
                      onClick={handleResetType}
                      className="rounded-full tracking-wide"
                    >
                      <span>Reset</span>
                    </Button>
                    <Button
                      size={"lg"}
                      disabled={!selectedType}
                      onClick={() =>
                        handleProceed(selectedType as "individual" | "entity")
                      }
                      className="w-full rounded-full tracking-wide"
                    >
                      <span>Proceed</span>
                      <FiArrowRight className="size-5" />
                    </Button>
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
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
