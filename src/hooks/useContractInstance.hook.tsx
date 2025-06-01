import { contract } from "@/utils/contract";
import { useCallback } from "react";
import {
  AccountInterface,
  Contract,
  RpcProvider,
  Abi,
  ProviderInterface,
  constants,
} from "starknet";

const envName = import.meta.env.VITE_ENV_NAME as "mainnet" | "sepolia";
const isMainnet = envName === "mainnet";
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

  const contractInstance = useCallback(
    (
      abi: Abi,
      address: string,
      provider: ProviderInterface | AccountInterface,
    ) => {
      const rpcProvider = new RpcProvider({
        chainId: chainId,
        nodeUrl: import.meta.env.VITE_STARKNET_NODE_URL,
        headers: JSON.parse(import.meta.env.VITE_STARKNET_RPC_HEADERS || "{}"),
      });

      const requestProvider = rpcProvider ?? provider;

      const contract = new Contract(abi, address, requestProvider);

      return contract;
    },
    [],
  );

  const getContractInstance = useCallback(() => {
    if (!window.Wallet?.Account || !window.Wallet?.IsConnected)
      throw new Error("Wallet not connected!");

    const contract = contractInstance(
      daoABI,
      daoAddress,
      window.Wallet.Account as unknown as AccountInterface,
    );

    return contract;
  }, [contractInstance, daoABI, daoAddress]);

  const getErc20Instance = useCallback(() => {
    if (!window.Wallet?.Account || !window.Wallet?.IsConnected)
      throw new Error("Wallet not connected!");

    const contract = contractInstance(
      erc20ABI,
      erc20Address,
      window.Wallet.Account as unknown as AccountInterface,
    );

    return contract;
  }, [contractInstance, erc20ABI, erc20Address]);

  const getErc721Instance = useCallback(() => {
    if (!window.Wallet?.Account || !window.Wallet?.IsConnected)
      throw new Error("Wallet not connected!");

    const contract = contractInstance(
      erc721ABI,
      erc721Address,
      window.Wallet.Account as unknown as AccountInterface,
    );

    return contract;
  }, [contractInstance, erc721ABI, erc721Address]);

  return {
    getContractInstance,
    getErc20Instance,
    getErc721Instance,
  };
};
