import { lcStorage } from "@/lib/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Balance {
  value: bigint;
  decimals: number;
  symbol: string;
  formatted: string;
}

interface WalletState {
  currentConnector: {
    id: string | null;
    name: string | null;
    icon:
      | string
      | {
          dark: string;
          light: string;
        }
      | undefined;
  } | null;
  walletAddress: string | null;
  contractOwner: string | null;
  isWalletConnected: boolean;
  hasRegistered: boolean;
  selectedToken: "starknet" | "coiton";
  walletBalance: Balance | undefined;
}

const savedConnector =
  lcStorage.load<Partial<WalletState["currentConnector"]>>("currentConnector");

const initialState: WalletState = {
  currentConnector: savedConnector
    ? {
        id: savedConnector.id ?? null,
        name: savedConnector.name ?? null,
        icon: savedConnector.icon ?? undefined,
      }
    : null,
  walletAddress: null,
  contractOwner: null,
  isWalletConnected: false,
  hasRegistered: false,
  selectedToken: "coiton",
  walletBalance: undefined,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setCurrentConnector(
      state,
      action: PayloadAction<WalletState["currentConnector"]>,
    ) {
      state.currentConnector = action.payload;
      lcStorage.save("currentConnector", action.payload);
    },
    setWalletAddress(state, action: PayloadAction<string | null>) {
      state.walletAddress = action.payload;
    },
    setContractOwner(state, action: PayloadAction<string | null>) {
      state.contractOwner = action.payload;
    },
    setHasRegistered(state, action: PayloadAction<boolean>) {
      state.hasRegistered = action.payload;
    },
    setSelectedToken(state, action: PayloadAction<"coiton" | "starknet">) {
      state.selectedToken = action.payload;
    },
    setWalletBalance(state, action: PayloadAction<Balance | undefined>) {
      state.walletBalance = action.payload;
    },
    setIsWalletConnected(state, action: PayloadAction<boolean>) {
      state.isWalletConnected = action.payload;
    },
    resetWallet(state) {
      state.currentConnector = null;
      state.walletAddress = null;
      state.isWalletConnected = false;
      lcStorage.clear("currentConnector");
    },
  },
});

export const {
  setCurrentConnector,
  setWalletAddress,
  setContractOwner,
  setIsWalletConnected,
  resetWallet,
  setHasRegistered,
  setSelectedToken,
  setWalletBalance,
} = walletSlice.actions;

export default walletSlice.reducer;
