import { Fragment, useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster as SonnerToast } from "./components/ui/sonner";
import { Toaster as NoticeToast } from "./components/ui/toaster";
import { routes } from "./routes";

import { useAppDispatch, useAppSelector } from "./store";
import { useContractInstance } from "./hooks/useContractInstance.hook";
import { byteArrayToString, toHex } from "./lib/starknet/utils";
import { generateAvatarFromAddress } from "./lib/utils";

import {
  setIsWalletConnected,
  setWalletAddress,
  setHasRegistered,
  setContractOwner,
} from "./store/slice/wallet.slice";
import { setCredential, User } from "./store/slice/credential.slice";
import { setListing, Listing } from "./store/slice/listing.slice";
import { setUsers } from "./store/slice/users.slice";

import useWalletHook from "./hooks/useWallet.hook";
import { SessionAccountInterface } from "@argent/invisible-sdk";
import { CairoCustomEnum } from "starknet";
import { toast } from "sonner";

interface Wallet {
  IsConnected: boolean;
  Account: SessionAccountInterface | undefined;
}

declare global {
  interface Window {
    Wallet: Wallet;
  }
}

export default function App() {
  const dispatch = useAppDispatch();
  const { walletAddress } = useAppSelector((state) => state.wallet);

  const { getArgentWallet } = useWalletHook();
  const { getContractInstance } = useContractInstance();

  const individualEnum = new CairoCustomEnum({ Individual: {} } as any);
  const entityEnum = new CairoCustomEnum({ Entity: {} } as any);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatUser = (user: any): User => ({
    ...user,
    address: toHex(user.address),
    id: Number(user.id),
    details: byteArrayToString(user.details),
    user_type: user.user_type.variant.Entity ? "Entity" : "Individual",
  });

  useEffect(() => {
    const fetchListings = async () => {
      const contract = getContractInstance();
      if (!contract) return;
      try {
        const listings = await contract.get_all_listings();

        const structured: Listing[] = listings.map((listing: any) => {
          const user = listing.owner_details.Some;
          const userConstruct = formatUser(user);

          return {
            id: Number(listing.id),
            owner: toHex(listing.owner),
            price: Number(listing.price),
            tag: listing.tag.variant.Sold ? "Sold" : "ForSale",
            details: byteArrayToString(listing.details),
            owner_details: userConstruct,
          };
        });

        dispatch(setListing(structured));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      const contract = getContractInstance();
      if (!contract) return;
      try {
        const [individualsRaw, entitiesRaw] = await Promise.all([
          contract.get_users_by_type(individualEnum),
          contract.get_users_by_type(entityEnum),
        ]);

        const combined = [
          ...entitiesRaw.map(formatUser),
          ...individualsRaw.map(formatUser),
        ];
        dispatch(setUsers(combined));
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    setTimeout(() => {
      fetchListings();
      fetchUsers();
    }, 10);
  }, [dispatch, entityEnum, getContractInstance, individualEnum]);

  useEffect(() => {
    const updateWalletAddress = () => {
      const connected = window.Wallet?.IsConnected;
      const address = window.Wallet?.Account?.address;

      if (!connected || !address) {
        dispatch(setWalletAddress(null));
        return;
      }

      dispatch(setWalletAddress(address));
      dispatch(setCredential({ avatar: generateAvatarFromAddress(address) }));
    };

    updateWalletAddress();

    if (!walletAddress && !intervalRef.current) {
      intervalRef.current = setInterval(updateWalletAddress, 500);
    }

    const handleWalletChange = () => {
      updateWalletAddress();
    };

    window.addEventListener("windowWalletClassChange", handleWalletChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener("windowWalletClassChange", handleWalletChange);
    };
  }, [walletAddress, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const argentWebWallet = getArgentWallet();
        const response = await argentWebWallet.connect();
        if (!response || response.account.getSessionStatus() !== "VALID")
          return;

        window.Wallet = {
          Account: response.account,
          IsConnected: true,
        };

        dispatch(setIsWalletConnected(true));
        dispatch(setWalletAddress(response.account.address));

        const event = new Event("windowWalletClassChange");
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Failed to connect to Argent Web Wallet", error);
      }
    })();
  }, [dispatch, getArgentWallet]);

  useEffect(() => {
    (async () => {
      try {
        if (!walletAddress) return;

        const contract = await getContractInstance();
        if (!contract) return;

        const user = await contract.get_user(walletAddress);
        const contractOwner = await contract.get_owner();

        const userConstruct = formatUser(user);

        dispatch(setHasRegistered(true));
        dispatch(setCredential(userConstruct));
        // dispatch(
        //   setContractOwner(
        //     "0x025de235bcba49aa753587d4ae45f6d71908db9e2b4152dca1246b80516e88ad",
        //   ),
        // );
        dispatch(setContractOwner(toHex(contractOwner)));
      } catch (error) {
        console.error("Error fetching user credentials:", error);
        toast.error("USER_NOT_REGISTERED");
      }
    })();
  }, [walletAddress, dispatch, getContractInstance]);

  return (
    <Fragment>
      <SonnerToast richColors theme="light" />
      <NoticeToast />
      <RouterProvider router={routes} />
    </Fragment>
  );
}
