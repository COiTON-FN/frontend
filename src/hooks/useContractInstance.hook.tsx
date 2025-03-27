import { contract } from "@/utils/contract";
import { useCallback } from "react";
import { toast } from "sonner";
import { AccountInterface, Contract, RpcProvider } from "starknet";

export const useContractInstance = () => {
  const { daoAddress, daoABI, erc20ABI, erc20Address, erc721ABI, erc721Address } = contract;
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

  const getErc721Instance = useCallback(() => {
    if (!window.Wallet?.Account || !window.Wallet?.IsConnected) {
      toast.error("Wallet not connected!");
      return;
    }

    const contract = new Contract(
      erc721ABI,
      erc721Address,
      window.Wallet.Account as unknown as AccountInterface
    );

    return contract;
  }, [erc721ABI, erc721Address]);

  return { getContractInstance, getErc20Instance, getErc721Instance, getRPCProviderContract };
};
