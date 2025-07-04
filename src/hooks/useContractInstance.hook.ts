import { contract } from "@/utils/contract";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  Contract,
  RpcProvider,
  Abi,
  constants,
  AccountInterface,
} from "starknet";

const envName = import.meta.env.VITE_ENV_NAME as "mainnet" | "sepolia";
const isMainnet = envName === "mainnet";
const nodeUrl = constants.RPC_NODES.SN_SEPOLIA[0];
const chainId = isMainnet
  ? constants.StarknetChainId.SN_MAIN
  : constants.StarknetChainId.SN_SEPOLIA;

export const useContractInstance = () => {
  const {
    daoAddress,
    daoABI,
    erc20ABI,
    erc20Address,
    erc721ABI,
    erc721Address,
  } = contract;

  // const contractInstance = useCallback((abi: Abi, address: string) => {
  //   const isConnected = window?.Wallet?.IsConnected && window?.Wallet?.Account;
  //   const provider = isConnected
  //     ? (window?.Wallet?.Account as unknown as AccountInterface)
  //     : new RpcProvider({ chainId, nodeUrl });

  //   if (!isConnected) {
  //     toast.warning("Using read-only provider");
  //   }

  //   return new Contract(abi, address, provider);
  // }, []);

  // const contractInstance = useCallback((abi: Abi, address: string) => {
  //   if (!window.Wallet?.Account || !window.Wallet?.IsConnected) {
  //     toast.error("Wallet not connected!");
  //     return;
  //   }

  //   const contract = new Contract(
  //     abi,
  //     address,
  //     window.Wallet.Account as unknown as AccountInterface,
  //   );

  //   return contract;
  // }, []);

  const rpcProviderContractInstance = useCallback(
    (abi: Abi, address: string) => {
      const provider = new RpcProvider({ chainId, nodeUrl });
      const contract = new Contract(abi, address, provider);
      return contract;
    },
    [],
  );

  const getWalletProviderContract = () => {
    if (!window.Wallet?.Account || !window.Wallet?.IsConnected) {
      toast.error("Wallet not connected!");
      return;
    }

    const contract = new Contract(
      daoABI,
      daoAddress,
      window.Wallet.Account as unknown as AccountInterface,
    );

    return contract;
  };

  const getContractInstance = useCallback(() => {
    const contract = rpcProviderContractInstance(daoABI, daoAddress);

    return contract;
  }, [daoABI, daoAddress, rpcProviderContractInstance]);

  const getErc20Instance = useCallback(() => {
    const contract = rpcProviderContractInstance(erc20ABI, erc20Address);

    return contract;
  }, [erc20ABI, erc20Address, rpcProviderContractInstance]);

  const getErc721Instance = useCallback(() => {
    const contract = rpcProviderContractInstance(erc721ABI, erc721Address);

    return contract;
  }, [erc721ABI, erc721Address, rpcProviderContractInstance]);

  return {
    getContractInstance,
    getErc20Instance,
    getErc721Instance,
    getWalletProviderContract,
  };
};
