import { RootState } from "@/store";
import { useSelector } from "react-redux";
import BasicsForm from "./building-steps/basics";
import AddressForm from "./building-steps/address";
import DetailsForm from "./building-steps/details";
import AmenitiesAndFeatures from "./building-steps/amenities";
import FloorPlanForm from "./building-steps/floor-plan";

export default function BuildingForm() {
  const newListingState = useSelector((state: RootState) => state.newListing);

  const renderStep = () => {
    switch (newListingState.currentStep) {
      case 1:
        return <BasicsForm />;
      case 2:
        return <AddressForm />;
      case 3:
        return <DetailsForm />;
      case 4:
        return <AmenitiesAndFeatures />;
      case 5:
        return <FloorPlanForm />;
      default:
        return null;
    }
  };

  return <div className="flex w-full flex-col">{renderStep()}</div>;
}
