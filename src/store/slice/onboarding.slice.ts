import { lcStorage } from "@/lib/utils";
import { ONBOARDING_SCHEMA } from "@/utils/validators";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface I_ONBOARDING_STATE {
  currentStep: number;
  formData: Partial<ONBOARDING_SCHEMA>;
}

const savedOnboardingData =
  lcStorage.load<Partial<ONBOARDING_SCHEMA>>("onboarding_form") || {};

const initialState: I_ONBOARDING_STATE = {
  currentStep: 1,
  formData: savedOnboardingData,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateFormData: (
      state,
      action: PayloadAction<Partial<ONBOARDING_SCHEMA>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
      lcStorage.save<Partial<ONBOARDING_SCHEMA>>(
        "onboarding_form",
        state.formData
      );
    },
    resetForm: (state) => {
      state.currentStep = 1;
      state.formData = {};
      lcStorage.clear("onboarding_form");
    },
  },
});

export const { setCurrentStep, updateFormData, resetForm } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;
