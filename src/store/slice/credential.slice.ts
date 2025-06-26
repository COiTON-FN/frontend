import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = "Individual" | "Entity";

export type User = {
  id?: number;
  verified: boolean;
  details: any;
  user_type: UserType;
  address: string;
  registered: boolean;
  avatar?: string;
};
interface CredentialState {
  credential: User | null;
}

const initialState: CredentialState = {
  credential: null,
};

const credentialSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<any>) => {
      state.credential = { ...action.payload, ...state.credential };
    },

    clearCredentials: (state) => {
      state.credential = null;
    },
  },
});

export const { setCredential, clearCredentials } = credentialSlice.actions;
export default credentialSlice.reducer;
