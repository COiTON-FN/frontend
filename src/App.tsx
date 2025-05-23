import { RouterProvider } from "react-router-dom";
import { Toaster as SonnerToast } from "./components/ui/sonner";
import { Toaster as NoticeToast } from "./components/ui/toaster";
import { routes } from "./routes";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { useContractInstance } from "./hooks/useContractInstance.hook";
import {
  setHasRegistered,
  setIsWalletConnected,
  setWalletAddress,
} from "./store/slice/wallet.slice";
import { toast } from "sonner";
import { byteArrayToString } from "./lib/starknet/utils";
import { setCredential, User } from "./store/slice/credential.slice";
import { Listing, setListing } from "./store/slice/listing.slice";
import { generateAvatarFromAddress } from "./lib/utils";
import { SessionAccountInterface } from "@argent/invisible-sdk";
import useWalletHook from "./hooks/useWallet.hook";

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
  const { walletAddress } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();
  const { getArgentWallet } = useWalletHook();
  const { getContractInstance } = useContractInstance();

  useEffect(() => {
    setTimeout(() => {
      (async function () {
        try {
          const contract = getContractInstance();
          if (!contract) return;

          const listings = await contract.get_all_listings();

          const structured: Listing[] = listings.map((listing: any) => {
            const user = listing.owner_details.Some;

            const user_construct: User = {
              ...user,
              address: BigInt(user.address).toString(16),
              id: Number(user.id),
              details: byteArrayToString(user.details),
              user_type: user.user_type.variant.Entity
                ? "Entity"
                : "Individual",
            };
            return {
              id: Number(listing.id),
              owner: BigInt(listing.owner).toString(16),
              price: Number(listing.price),
              tag: listing.tag.variant.Sold ? "Sold" : "ForSale",
              details: byteArrayToString(listing.details),
              owner_details: user_construct,
            };
          });

          dispatch(setListing(structured));
        } catch (error) {
          console.log(error);
        }
      })();
    }, 200);
  }, [dispatch, getContractInstance]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateWalletAddress = () => {
      if (!window.Wallet?.IsConnected) {
        dispatch(setWalletAddress(null));
        return;
      }

      if (window.Wallet?.Account?.address && !walletAddress) {
        dispatch(setWalletAddress(window.Wallet.Account.address));
        dispatch(
          setCredential({
            avatar: generateAvatarFromAddress(window.Wallet.Account.address),
          }),
        );
      }
    };

    updateWalletAddress();

    // Start polling only if walletAddress is not set
    if (!walletAddress) {
      intervalRef.current = setInterval(updateWalletAddress, 500);
    }

    const handleWalletChange = () => {
      updateWalletAddress();
    };

    window.addEventListener("windowWalletClassChange", handleWalletChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("windowWalletClassChange", handleWalletChange);
    };
  }, [walletAddress, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const argentWebWallet = getArgentWallet();
        const response = await argentWebWallet.connect();

        if (!response || response === undefined) return null;

        if (response?.account?.getSessionStatus() !== "VALID") {
          console.log("Session is not valid");
          return;
        }

        window.Wallet = {
          Account: response?.account,
          IsConnected: true,
        };

        dispatch(setIsWalletConnected(true));
        dispatch(setWalletAddress(response?.account?.address));

        const event = new Event("windowWalletClassChange");
        window.dispatchEvent(event);
        console.log({
          response,
          callbackData: response?.callbackData,
          approvalTransactionHash: response?.approvalTransactionHash,
        });
      } catch (error) {
        console.error("Failed to connect to Argent Web Wallet", error);
      }
    })();
  }, [dispatch, getArgentWallet]);

  useEffect(() => {
    (async function () {
      try {
        if (!walletAddress) return;
        const contract = getContractInstance();
        if (!contract) return;
        const user = await contract.get_user(walletAddress);
        dispatch(setHasRegistered(true));
        const user_construct: User = {
          ...user,
          address: BigInt(user.address).toString(16),
          id: Number(user.id),
          details: byteArrayToString(user.details),
          user_type: user.user_type.variant.Entity ? "Entity" : "Individual",
        };
        dispatch(setCredential(user_construct));
      } catch (error) {
        console.log("Error fetching user credentials: ", error);
        toast.error("USER_NOT_REGISTERED");
      }
    })();
  }, [dispatch, getContractInstance, walletAddress]);

  return (
    <Fragment>
      <SonnerToast richColors theme="light" />
      <NoticeToast />
      <RouterProvider router={routes} />
    </Fragment>
  );
}
