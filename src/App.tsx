import { RouterProvider } from "react-router-dom";
import { Toaster as SonnerToast } from "./components/ui/sonner";
import { Toaster as NoticeToast } from "./components/ui/toaster";
import { routes } from "./routes";
import { Fragment } from "react/jsx-runtime";
import { WalletAccount } from "starknet";
import { useWalletHook } from "./hooks/useWallet.hook";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { useContractInstance } from "./hooks/useContractInstance.hook";
import { setHasRegistered, setWalletAddress } from "./store/slice/wallet.slice";
import { toast } from "sonner";
import { byteArrayToString } from "./lib/starknet/utils";
import { setCredential, User } from "./store/slice/credential.slice";
import { Listing, setListing } from "./store/slice/listing.slice";

interface Wallet {
  IsConnected: boolean;
  Account: WalletAccount | typeof undefined;
}

declare global {
  interface Window {
    Wallet: Wallet;
  }
}

export default function App() {
  const { walletAddress } = useAppSelector(state => state.wallet)
  const dispatch = useAppDispatch();
  const { handleConnectWallet } = useWalletHook();
  const { getContractInstance, getRPCProviderContract } = useContractInstance()

  useEffect(() => {
    handleConnectWallet(true);
  }, [])


  useEffect(() => {

    setTimeout(() => {
      (async function () {
        try {
          const contract = window.Wallet?.IsConnected ? getContractInstance() : getRPCProviderContract();
          if (!contract) return;
          const listings = await contract.get_all_listings();

          let structured: Listing[] = listings.map((listing: any) => {
            const user = listing.owner_details.Some;

            const user_construct: User = {
              ...user,
              address: BigInt(user.address).toString(16),
              id: Number(user.id),
              details: byteArrayToString(user.details),
              user_type: user.user_type.variant.Entity ? "Entity" : "Individual"
            }
            return {
              id: Number(listing.id),
              owner: BigInt(listing.owner).toString(16),
              price: Number(listing.price),
              tag: listing.tag.variant.Sold ? "Sold" : "ForSale",
              details: byteArrayToString(listing.details),
              owner_details: user_construct
            }
          })

          dispatch(setListing(structured));
          console.log(structured)
        } catch (error) {
          console.log(error)
        }
      }())
    }, 200);
  }, [

  ]);


  useEffect(() => {
    let interval: any;
    const handle_wallet_change = () => {
      if (!window.Wallet?.IsConnected) {
        dispatch(setWalletAddress(null));
        return;
      }
      interval = setInterval(() => {
        if (walletAddress) {
          clearInterval(interval);
        }
        if (window.Wallet) {
          if ((window.Wallet.Account as any)?.address) {
            if (!walletAddress) {
              dispatch(
                setWalletAddress(
                  (window.Wallet?.Account as any)?.address ?? null
                )
              );
            }

            clearInterval(interval);
          }
        } else {
          clearInterval(interval);
        }
      }, 500);
    };

    handle_wallet_change();

    window.addEventListener("windowWalletClassChange", handle_wallet_change);
    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "windowWalletClassChange",
        handle_wallet_change
      );
    };
  }, []);


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
          user_type: user.user_type.variant.Entity ? "Entity" : "Individual"
        }
        dispatch(setCredential(user_construct))
      } catch (error) {
        toast.error("USER_NOT_REGISTERED");
      }
    }())
  }, [walletAddress])
  return (
    <Fragment>
      {/* {isLoading && (
        <div className="fixed top-0 left-0 z-50 backdrop-blur-sm bg-black/30 size-full pointer-events-auto select-none overflow-hidden flex items-center justify-center">
          <Loader className="animate-spin size-8 text-white" />
        </div>
      )} */}
      <SonnerToast richColors theme="light" />
      <NoticeToast />
      <RouterProvider router={routes} />
    </Fragment>
  );
}
