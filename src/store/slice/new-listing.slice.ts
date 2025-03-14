import { lcStorage } from "@/lib/utils";
import {
  BuildingFormSchemaTypes,
  LandFormSchemaTypes,
} from "@/pages/(app)/list-property/list-property.page";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  currentStep: number;
  formData: Partial<BuildingFormSchemaTypes | LandFormSchemaTypes>;
}

const savedFormData =
  lcStorage.load<Partial<BuildingFormSchemaTypes | LandFormSchemaTypes>>(
    "new_listing",
  ) || {};

const initialState: FormState = {
  currentStep: 1,
  formData: savedFormData,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateFormData: (
      state,
      action: PayloadAction<
        Partial<BuildingFormSchemaTypes | LandFormSchemaTypes>
      >,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
      lcStorage.save<Partial<BuildingFormSchemaTypes | LandFormSchemaTypes>>(
        "new_listing",
        state.formData,
      );
    },
    resetForm: (state) => {
      state.currentStep = 1;
      state.formData = {};
      lcStorage.clear("new_listing");
    },
  },
});

export const { setCurrentStep, updateFormData, resetForm } = formSlice.actions;
export default formSlice.reducer;
