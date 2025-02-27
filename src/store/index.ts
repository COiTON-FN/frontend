import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./slice/listing.slice";
import habitReducer from "./slice/habit.slice";
import walletReducer from "./slice/wallet.slice";
import newListingReducer from "./slice/new-listing.slice";
import modalReducer from "./slice/modal.slice";
import onboardingReducer from "./slice/onboarding.slice";
import credentialReducer from "./slice/credential.slice";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    habits: habitReducer,
    listing: listingReducer,
    wallet: walletReducer,
    newListing: newListingReducer,
    modal: modalReducer,
    onboarding: onboardingReducer,
    credential: credentialReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;



// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();


export default store;
