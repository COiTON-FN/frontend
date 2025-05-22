import { ArgentWebWallet } from "@argent/invisible-sdk";
import { contract } from "@/utils/contract";
import { useAppDispatch } from "@/store";
import {
  resetWallet,
  setCurrentConnector,
  setIsWalletConnected,
  setWalletAddress,
} from "@/store/slice/wallet.slice";
import { setCredential } from "@/store/slice/credential.slice";

const useWalletHook = () => {
  const getArgentWallet = () => {
    const argentWebWallet = ArgentWebWallet.init({
      appName: "COiTON",
      environment: "sepolia",
      sessionParams: {
        allowedMethods: [
          {
            contract: contract.daoAddress,
            selector: "create_listing",
          },
          {
            contract: contract.daoAddress,
            selector: "create_purchase_request",
          },
          {
            contract: contract.daoAddress,
            selector: "register",
          },
          {
            contract: contract.daoAddress,
            selector: "approve_purchase_request",
          },
          {
            contract: contract.erc721Address,
            selector: "approve",
          },
          {
            contract: contract.erc20Address,
            selector: "approve",
          },
          {
            contract: contract.erc20Address,
            selector: "allowance",
          },
        ],
        validityDays: 30,
      },

      paymasterParams: {
        apiKey: "", // avnu paymasters API Key
      },
    });

    return argentWebWallet;
  };

  const dispatch = useAppDispatch();

  const handleConnectWallet = async (callbackData?: string) => {
    const argentWebWallet = getArgentWallet();

    const response = await argentWebWallet.requestConnection({
      callbackData: callbackData,
      approvalRequests: [
        {
          tokenAddress: contract.erc20Address,
          amount: BigInt("100000000000000000000").toString(),
          spender: contract.erc20Address,
        },
      ],
    });
    console.log(response);

    if (response) {
      window.Wallet = {
        Account: response.account,
        IsConnected: true,
      };
      dispatch(setIsWalletConnected(true));
      dispatch(setWalletAddress(response.account.address));
      // Dispatch a custom event to notify about the change
      const event = new Event("windowWalletClassChange");
      window.dispatchEvent(event);
      return response.callbackData;
    }
  };

  const handleDisconnect = async () => {
    const argentWebWallet = getArgentWallet();
    await argentWebWallet.clearSession();

    window.Wallet = {
      Account: undefined,
      IsConnected: false,
    };
    dispatch(setCurrentConnector(null));
    dispatch(setIsWalletConnected(false));
    dispatch(setCredential(null));
    dispatch(resetWallet());
    const event = new Event("windowWalletClassChange");
    window.dispatchEvent(event);
  };

  return { handleConnectWallet, handleDisconnect, getArgentWallet };
};

export default useWalletHook;
