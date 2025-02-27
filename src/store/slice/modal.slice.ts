import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isPurchaseTokenModalOpen: boolean;
  hasStakedModalOpen: boolean;
  hasAllowedSpending: boolean;
}

const initialState: ModalState = {
  isPurchaseTokenModalOpen: false,
  hasStakedModalOpen: false,
  hasAllowedSpending: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setIsPurchaseTokenModalOpen(state, action: PayloadAction<boolean>) {
      state.isPurchaseTokenModalOpen = action.payload;
    },
    setHasStakedModalOpen(state, action: PayloadAction<boolean>) {
      state.hasStakedModalOpen = action.payload;
    },
    setHasAllowedSpending(state, action: PayloadAction<boolean>) {
      state.hasAllowedSpending = action.payload;
    },
  },
});

export const {
  setIsPurchaseTokenModalOpen,
  setHasStakedModalOpen,
  setHasAllowedSpending,
} = modalSlice.actions;

export default modalSlice.reducer;
