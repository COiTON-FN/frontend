import { lcStorage } from "@/lib/utils";
import { CREATE_LISTING_SCHEMA } from "@/utils/validators";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  currentListPropertyStep: number;
  listingData: Partial<CREATE_LISTING_SCHEMA>;
}

const storage_key = "list_property";

const savedListingData =
  lcStorage.load<Partial<CREATE_LISTING_SCHEMA>>(storage_key) || {};

const initialState: FormState = {
  currentListPropertyStep: 1,
  listingData: savedListingData,
};

const listProperty = createSlice({
  name: "form",
  initialState,
  reducers: {
    setCurrentListPropertyStep: (state, action: PayloadAction<number>) => {
      state.currentListPropertyStep = action.payload;
    },
    updateListingData: (
      state,
      action: PayloadAction<Partial<CREATE_LISTING_SCHEMA>>
    ) => {
      state.listingData = { ...state.listingData, ...action.payload };
      lcStorage.save<Partial<CREATE_LISTING_SCHEMA>>(
        storage_key,
        state.listingData
      );
    },
    resetForm: (state) => {
      state.currentListPropertyStep = 1;
      state.listingData = {};
      lcStorage.clear(storage_key);
    },
  },
});

export const { setCurrentListPropertyStep, updateListingData, resetForm } =
  listProperty.actions;
export default listProperty.reducer;
