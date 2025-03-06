import { contract } from "@/utils/contract";
import { useCallback } from "react";
import { toast } from "sonner";
import { AccountInterface, Contract, RpcProvider } from "starknet";

export const useContractInstance = () => {
  const { daoAddress, daoABI, erc20ABI, erc20Address } = contract;
  const getContractInstance = useCallback(() => {

    if (!window.Wallet?.Account || !window.Wallet?.IsConnected) {
      toast.error("Wallet not connected!");

      return;
    }

    const contract = new Contract(
      daoABI,
      daoAddress,
      window.Wallet.Account as unknown as AccountInterface
    );



    return contract;
  }, [daoAddress, daoABI]);

  const getRPCProviderContract = () => {
    const provider = new RpcProvider({});
    const contract = new Contract(daoABI, daoAddress, provider);
    return contract;
  };

  const getErc20Instance = useCallback(() => {
    if (!window.Wallet?.Account || !window.Wallet?.IsConnected) {
      toast.error("Wallet not connected!");

      return;
    }


    const contract = new Contract(
      erc20ABI,
      erc20Address,
      window.Wallet.Account as unknown as AccountInterface
    );



    return contract;
  }, [erc20ABI, erc20Address]);

  return { getContractInstance, getErc20Instance, getRPCProviderContract };
};
