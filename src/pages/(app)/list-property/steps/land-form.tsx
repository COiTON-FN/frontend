import { RootState } from "@/store";
import { useSelector } from "react-redux";
import AddressForm from "./land-step/address";
import SurveyPlanForm from "./land-step/survey-plan";
import BasicsForm from "./land-step/basics";

export default function LandForm() {
  const newListingState = useSelector((state: RootState) => state.newListing);

  const renderStep = () => {
    switch (newListingState.currentStep) {
      case 1:
        return <AddressForm />;
      case 2:
        return <SurveyPlanForm />;
      case 3:
        return <BasicsForm />;
      default:
        return null;
    }
  };

  return <div className="flex w-full flex-col">{renderStep()}</div>;
}
