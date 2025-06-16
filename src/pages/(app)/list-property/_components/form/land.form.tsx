import { RiListCheck2 } from "react-icons/ri";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { listPropertyOptions } from "@/utils/constants";
import PropertyHeading from "../property-heading";
import Indicator from "../indicator";
import { RootState, useAppSelector } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { landFormSchema, LandFormSchemaProps } from "@/utils/validators";
import LandStepOne from "../steps/land-step/step-one";
import { Form } from "@/components/ui/form";
import LandStepTwo from "../steps/land-step/step-two";
import LandStepThree from "../steps/land-step/step-three";

interface LandFormProps {
  selectedType: "building" | "land" | null;
  handleResetType: () => void;
}

const steps = [
  {
    title: "Property Basics",
    subtitle: "Please provide your name and email",
    icon: MdOutlineFeaturedPlayList,
  },
  {
    title: "Address",
    subtitle: "Please provide your name and email",
    icon: RiListCheck2,
  },
  {
    title: "Survey Plan: (Property license)",
    subtitle: "Please provide property details",
    icon: MdOutlineFeaturedPlayList,
  },
];

export default function LandForm({
  selectedType,
  handleResetType,
}: LandFormProps) {
  const currentStep = useAppSelector(
    (state: RootState) => state.newListing.formStep,
  );
  const currentlySelected = listPropertyOptions.find(
    ({ type }) => type === selectedType,
  );

  const form = useForm<LandFormSchemaProps>({
    resolver: zodResolver(landFormSchema),
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LandStepOne propertyType={currentlySelected?.type as string} />;
      case 2:
        return <LandStepTwo />;
      case 3:
        return <LandStepThree />;
      default:
        return null;
    }
  };

  if (!currentlySelected) return null;

  return (
    <div className="w-full md:p-6 lg:p-8">
      <PropertyHeading
        icon={currentlySelected?.icon}
        title={currentlySelected?.title}
        description={currentlySelected?.description}
        handleResetType={handleResetType}
        selectedType={selectedType}
      />

      <div className="relative my-16 flex w-full grid-cols-1 gap-4 md:gap-6">
        <div className="sticky top-24 hidden h-max max-w-sm flex-1 lg:flex xl:max-w-md xl:px-6">
          <div className="flex h-full flex-1 flex-col gap-6">
            <p className="flex items-center whitespace-nowrap text-2xl font-bold capitalize leading-none text-primary">
              {currentlySelected?.type} Steps
            </p>
            <Indicator currentStep={currentStep} steps={steps} />
          </div>
        </div>

        <div className="flex w-full flex-1 justify-center 2xl:px-6">
          <Form {...form}>{renderStep()}</Form>
        </div>
      </div>
    </div>
  );
}
