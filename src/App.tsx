import { Fragment, useCallback, useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster as SonnerToast } from "./components/ui/sonner";
import { Toaster as NoticeToast } from "./components/ui/toaster";
import { routes } from "./routes";

import { useAppDispatch, useAppSelector } from "./store";
import { useContractInstance } from "./hooks/useContractInstance.hook";
import { byteArrayToString, toHex } from "./lib/starknet/utils";
import { formatUser, generateAvatarFromAddress } from "./lib/utils";

import {
  setIsWalletConnected,
  setWalletAddress,
  setHasRegistered,
  setContractOwner,
} from "./store/slice/wallet.slice";
import { setCredential } from "./store/slice/credential.slice";
import { setListing, Listing } from "./store/slice/listing.slice";
import { setUsers } from "./store/slice/users.slice";

import { useWalletHook } from "./hooks/useWallet.hook";
import { SessionAccountInterface } from "@argent/invisible-sdk";
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

  const { argentWebWallet } = useWalletHook();
  const { getContractInstance } = useContractInstance();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchListings = useCallback(async () => {
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
  }, [dispatch, getContractInstance]);

  const fetchUsers = useCallback(async () => {
    const contract = getContractInstance();
    if (!contract) return;
    try {
      const [individualsRaw, entitiesRaw] = await Promise.all([
        contract.get_users_by_type(0),
        contract.get_users_by_type(1),
      ]);

      const combined = [
        ...entitiesRaw.map(formatUser),
        ...individualsRaw.map(formatUser),
      ];

      dispatch(setUsers(combined));
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  }, [dispatch, getContractInstance]);

  useEffect(() => {
    setTimeout(() => {
      fetchListings();
      fetchUsers();
    }, 10);
  }, [fetchListings, fetchUsers]);

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
        const msg = "Failed to connect to Argent Web Wallet";
        console.error(msg, error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : "Failed to connect to Argent Web Wallet";
        toast.error(errorMessage);
      }
    })();
  }, [argentWebWallet, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        if (!walletAddress) return;

        const contract = getContractInstance();
        if (!contract) return;

        const user = await contract.get_user(walletAddress);
        const contractOwner = await contract.get_owner();

        const userConstruct = formatUser(user);

        dispatch(setHasRegistered(true));
        dispatch(setCredential(userConstruct));
        dispatch(setContractOwner(toHex(contractOwner)));
      } catch (error) {
        console.error("Error fetching user credentials:", error);
        toast.warning("Looks like you're not registered yet");
      }
    })();
  }, [dispatch, getContractInstance, walletAddress]);

  return (
    <Fragment>
      <SonnerToast richColors theme="dark" />
      <NoticeToast />
      <RouterProvider router={routes} />
    </Fragment>
  );
}
