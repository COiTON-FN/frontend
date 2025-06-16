import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const Indicator = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { title: string; subtitle: string; icon: any }[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      {steps.map(({ title, subtitle, icon: Icon }, _index) => (
        <div
          key={_index}
          className={cn(
            "group flex cursor-not-allowed items-start gap-4 opacity-50",
            {
              "cursor-pointer opacity-100": _index + 1 <= currentStep,
            },
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-full border border-[#EAECF0] bg-background",
                {
                  "bg-primary text-background": _index + 1 < currentStep,
                },
              )}
            >
              {_index + 1 < currentStep ? (
                <Check className="size-6 text-background" />
              ) : (
                <Icon className="size-6 text-primary" />
              )}
            </div>
            <span className="h-3 w-[2px] rounded-[2px] bg-[#EAECF0] group-last:hidden" />
          </div>

          <div className="mt-2 flex flex-col">
            <p className="font-medium text-primary">{title}</p>
            <span className="font-normal text-[#6C737F]">{subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Indicator;
