import { useForm } from "react-hook-form";
import { RiListCheck2 } from "react-icons/ri";
import { IoImagesOutline } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { MdOutlineFeaturedPlayList } from "react-icons/md";

import {
  buildingFormSchema,
  BuildingFormSchemaProps,
} from "@/utils/validators";
import { Form } from "@/components/ui/form";
import Indicator from "../indicator";
import PropertyHeading from "../property-heading";
import { listPropertyOptions } from "@/utils/constants";
import { RootState, useAppSelector } from "@/store";
import BuildingStepOne from "../steps/building-step/step-one";
import BuildingStepTwo from "../steps/building-step/step-two";
import BuildingStepThree from "../steps/building-step/step-three";
import BuildingStepFour from "../steps/building-step/step-four";
import BuildingStepFive from "../steps/building-step/step-five";

const steps = [
  {
    title: "Property Basics",
    subtitle: "Please provide your name and email",
    icon: MdOutlineFeaturedPlayList,
  },
  {
    title: "Address",
    subtitle: "Please provide property details",
    icon: RiListCheck2,
  },
  {
    title: "Details",
    subtitle: "Upload pictures of your property",
    icon: IoImagesOutline,
  },
  {
    title: "Amenities and Features",
    subtitle: "Upload pictures of your property",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Floor Plans",
    subtitle: "Upload pictures of your property",
    icon: HiOutlineDocumentText,
  },
];

export default function BuildingForm({
  selectedType,
  handleResetType,
}: {
  selectedType: "building" | "land" | null;
  handleResetType: () => void;
}) {
  const currentStep = useAppSelector(
    (state: RootState) => state.newListing.formStep,
  );
  const currentlySelected = listPropertyOptions.find(
    ({ type }) => type === selectedType,
  );

  const form = useForm<BuildingFormSchemaProps>({
    resolver: zodResolver(buildingFormSchema),
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BuildingStepOne propertyType={currentlySelected?.type as string} />
        );
      case 2:
        return <BuildingStepTwo />;
      case 3:
        return <BuildingStepThree />;
      case 4:
        return <BuildingStepFour />;
      case 5:
        return <BuildingStepFive />;
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
