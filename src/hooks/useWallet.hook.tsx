import { AppDispatch } from "@/store";
import { setCredential } from "@/store/slice/credential.slice";
import {
  resetWallet,
  setCurrentConnector,
  setIsWalletConnected,
  setWalletAddress,
} from "@/store/slice/wallet.slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { WalletAccount } from "starknet";


import { connect, disconnect } from "starknetkit";


export const useWalletHook = () => {
  const dispatch = useDispatch<AppDispatch>();



  async function handleDisconnect() {
    try {
      await disconnect();
      window.Wallet = {
        Account: undefined,
        IsConnected: false,
      };
      dispatch(
        setCurrentConnector(null)
      );
      dispatch(setIsWalletConnected(false));
      dispatch(setCredential(null))
      dispatch(resetWallet())

      const event = new Event("windowWalletClassChange");
      window.dispatchEvent(event);
    } catch (error: any) {
      toast.error(error.message || "OOPPSSS!!")

    }
  }

  async function handleConnectWallet(automatic: boolean = false) {
    try {
      const { wallet, connector } = await connect({ modalMode: automatic ? "neverAsk" : undefined })
      const myFrontendProviderUrl =
        "https://free-rpc.nethermind.io/sepolia-juno/v0_7";

      const myWalletAccount = new WalletAccount(
        { nodeUrl: myFrontendProviderUrl },
        wallet as any
      );
      window.Wallet = {
        Account: myWalletAccount as any,
        IsConnected: true,
      };

      dispatch(
        setCurrentConnector({
          id: connector?.id,
          name: connector?.name,
          icon: {
            dark: connector?.icon.dark!,
            light: connector?.icon.light!
          },
        })
      );
      dispatch(setIsWalletConnected(true));
      dispatch(setWalletAddress(myWalletAccount.address))
      const event = new Event("windowWalletClassChange");
      window.dispatchEvent(event);
    } catch (error: any) {
      console.log(error, JSON.stringify(error))
      toast.error(error.message || "OOPPSSS!!")
    }
  }

  return {
    handleDisconnect,
    handleConnectWallet,
  };
};
