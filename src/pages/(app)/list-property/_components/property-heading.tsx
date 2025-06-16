import { IconType } from "react-icons/lib";
import { IoClose } from "react-icons/io5";

import { Button } from "@/components/ui/button";

interface PropertyHeadingProps {
  title: string;
  description: string;
  icon: IconType;
  selectedType?: "building" | "land" | null;
  handleResetType?: () => void;
}

const PropertyHeading = ({
  title,
  description,
  selectedType,
  handleResetType,
  icon,
}: PropertyHeadingProps) => {
  const Icon = icon;
  return (
    <div className="flex w-full items-start justify-between gap-8">
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-primary/20 bg-primary p-2">
            <Icon className="size-5 text-white" />
          </div>
          <h2 className="font-sans text-xl font-semibold text-primary md:text-2xl">
            {title}
          </h2>
        </div>

        <p className="max-w-2xl text-base text-foreground">{description}</p>
      </div>
      {handleResetType && (
        <Button
          disabled={!selectedType}
          variant={"outline"}
          size={"icon"}
          onClick={handleResetType}
          className="size-10"
          title="Reset Type"
        >
          <IoClose className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default PropertyHeading;
