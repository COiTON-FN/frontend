import { useState, useEffect, useMemo } from "react";
import { ArgentWebWallet } from "@argent/invisible-sdk";
import { contract } from "@/utils/contract";
import { useAppDispatch } from "@/store";
import {
  setIsWalletConnected,
  setWalletAddress,
  setCurrentConnector,
} from "@/store/slice/wallet.slice";
import { setCredential } from "@/store/slice/credential.slice";

export const useWalletHook = () => {
  const dispatch = useAppDispatch();
  const [isConnecting, setIsConnecting] = useState(false);

  const argentWebWallet = useMemo(() => {
    return ArgentWebWallet.init({
      appName: "COiTON",
      environment: "sepolia",
      sessionParams: {
        allowedMethods: [
          { contract: contract.daoAddress, selector: "create_listing" },
          {
            contract: contract.daoAddress,
            selector: "create_purchase_request",
          },
          { contract: contract.daoAddress, selector: "register" },
          {
            contract: contract.daoAddress,
            selector: "approve_purchase_request",
          },
          { contract: contract.erc721Address, selector: "approve" },
          { contract: contract.erc20Address, selector: "approve" },
          { contract: contract.erc20Address, selector: "allowance" },
        ],
        validityDays: 30,
      },
      paymasterParams: { apiKey: "" },
    });
  }, []);

  useEffect(() => {
    argentWebWallet
      .connect()
      .then((response) => {
        if (response) {
          dispatch(setIsWalletConnected(true));
          dispatch(setWalletAddress(response.account.address));
          window.Wallet = {
            Account: response.account,
            IsConnected: true,
          };
          dispatch(
            setCurrentConnector({
              id: "argent",
              name: "Argent",
              icon: undefined,
            }),
          );
        }
      })
      .catch(console.error);
  }, [argentWebWallet, dispatch]);

  const handleConnectWallet = async (callbackData?: string) => {
    setIsConnecting(true);
    try {
      const resp = await argentWebWallet.requestConnection({
        callbackData,
        approvalRequests: [
          {
            tokenAddress: contract.erc20Address,
            amount: BigInt("100000000000000000000").toString(),
            spender: contract.erc20Address,
          },
        ],
      });
      if (resp) {
        dispatch(setIsWalletConnected(true));
        dispatch(setWalletAddress(resp.account.address));
        dispatch(
          setCurrentConnector({
            id: "argent",
            name: "Argent",
            icon: undefined,
          }),
        );
        window.Wallet = {
          Account: resp.account,
          IsConnected: true,
        };
        return resp.callbackData;
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await argentWebWallet.clearSession();
    dispatch(setCurrentConnector(null));
    dispatch(setIsWalletConnected(false));
    dispatch(setCredential(null));
    window.Wallet = { Account: undefined, IsConnected: false };
  };

  return {
    isConnecting,
    handleConnectWallet,
    handleDisconnect,
    argentWebWallet,
  };
};
