import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./slice/listing.slice";
import walletReducer from "./slice/wallet.slice";
import newListingReducer from "./slice/new-listing.slice";
import onboardingReducer from "./slice/onboarding.slice";
import credentialReducer from "./slice/credential.slice";
import usersReducer from "./slice/users.slice";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    listing: listingReducer,
    wallet: walletReducer,
    newListing: newListingReducer,
    onboarding: onboardingReducer,
    credential: credentialReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
