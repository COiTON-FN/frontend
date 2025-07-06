import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listPropertyOptions } from "@/utils/constants";
import { BsHouses } from "react-icons/bs";
import PropertyHeading from "./property-heading";

interface PropertyTypeProps {
  setSelectedType: (selectedType: "building" | "land" | null) => void;
  selectedType: "building" | "land" | null;
  handleResetType: () => void;
}

export default function PropertyType({
  selectedType,
  setSelectedType,
  handleResetType,
}: PropertyTypeProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");

  React.useEffect(() => {
    setSelectedType(typeParam as "building" | "land" | null);
  }, [setSelectedType, typeParam]);

  const handleProceed = (type: "building" | "land") => {
    navigate(`/list-property?type=${type}`);
  };

  return (
    <div className="w-full max-w-[1000px] md:p-6 lg:p-8">
      <PropertyHeading
        icon={BsHouses}
        title="What are you listing?"
        description="Select the category that best describes your property to continue with
          the listing process"
      />

      <div className="my-8 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        {listPropertyOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedType === option.type;

          return (
            <div
              role="button"
              key={option.type}
              onClick={() => setSelectedType(option.type)}
              className={cn(
                "group relative w-full cursor-pointer overflow-hidden rounded-2xl border bg-background transition-all duration-300",
                {
                  "border-primary": isSelected,
                },
              )}
            >
              <div className="relative overflow-hidden rounded-2xl p-6 transition-all sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-6">
                  <div
                    className={cn(
                      "rounded-xl bg-secondary/80 p-4 dark:bg-neutral-900/80",
                      {
                        "bg-primary/10 dark:bg-primary/10": isSelected,
                      },
                    )}
                  >
                    <Icon
                      className={cn("size-8 text-foreground", {
                        "text-primary": isSelected,
                      })}
                    />
                  </div>
                  {isSelected && (
                    <motion.div
                      className="rounded-full bg-primary/10 p-2"
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

                <div className="mb-6">
                  <h3 className="font-sans text-xl font-medium text-foreground md:text-2xl">
                    {option.title}
                  </h3>
                  <p
                    className={cn("text-base text-foreground", {
                      "text-muted-foreground": isSelected,
                    })}
                  >
                    {option.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-sans text-sm font-medium">
                    Common Types:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {option.subTypes.map((subType, index) => {
                      const SubIcon = subType.icon;
                      return (
                        <div
                          key={index}
                          className={cn(
                            "flex flex-wrap items-center space-x-2 rounded-lg border border-border/60 bg-secondary/80 px-3 py-2 text-sm text-muted-foreground dark:bg-neutral-900/80",
                            {
                              "border-primary/10 bg-primary/10 text-primary dark:bg-primary/10":
                                isSelected,
                            },
                          )}
                        >
                          <SubIcon className="size-4" />
                          <span className="font-medium">{subType.label}</span>
                        </div>
                      );
                    })}
                  </div>
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
      </div>

      <div
        className={cn("pointer-events-none flex items-center gap-4 opacity-0", {
          "pointer-events-auto opacity-100": selectedType,
        })}
      >
        <Button
          disabled={!selectedType}
          variant={"outline"}
          className="px-7"
          onClick={handleResetType}
        >
          Reset
        </Button>
        <Button
          disabled={!selectedType}
          onClick={() => handleProceed(selectedType as "building" | "land")}
          className="px-7"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
}
