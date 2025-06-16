import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LuLogOut } from "react-icons/lu";
import {
  cn,
  copyToClipboard,
  generateAvatarFromAddress,
  truncateAddr,
} from "@/lib/utils";
import { AppDispatch, RootState } from "@/store";
import { ChevronDown, Search } from "lucide-react";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { IoCopyOutline, IoWalletOutline } from "react-icons/io5";
import { RiUser6Line } from "react-icons/ri";
import { useWalletHook } from "@/hooks/useWallet.hook";
import { setSelectedToken } from "@/store/slice/wallet.slice";
import { MdVerified } from "react-icons/md";
import MaxWrapper from "@/components/shared/max-wrapper";
import { useIsMobileHook } from "@/hooks/useMobile.hook";
import Notifications from "./notifications";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { handleDisconnect, handleConnectWallet, isConnecting } =
    useWalletHook();
  const isMobile = useIsMobileHook();

  const walletStore = useSelector((state: RootState) => state.wallet);
  const credentialStore = useSelector(
    (state: RootState) => state.credential.credential,
  );

  useEffect(() => {
    if (walletStore.isWalletConnected) {
      generateAvatarFromAddress(window.Wallet.Account?.address as string);
    }
  }, [walletStore.isWalletConnected]);

  const connectWallet = async () => {
    try {
      if (window.Wallet?.IsConnected) return;

      await handleConnectWallet();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sticky left-0 top-0 z-30 h-20 w-full border-b border-[#EAECF0] bg-background/80 backdrop-blur-xl sm:bg-background sm:backdrop-blur-0">
      <MaxWrapper className="flex h-full items-center gap-6">
        <div className="flex h-full w-full max-w-sm items-center gap-3 xl:max-w-md">
          <SidebarTrigger className="rounded-full" />
          <Separator className="hidden h-[30%] w-px lg:flex" />
          <div className="relative hidden h-11 flex-1 rounded-full bg-secondary sm:h-14 lg:flex">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/80" />
            <Input
              placeholder="Search for property..."
              type="search"
              className="h-full flex-1 !rounded-full !pl-11 !text-base tracking-wide"
            />
          </div>
        </div>

        <div className="flex h-full flex-1 items-center justify-end gap-3">
          <Notifications />

          <Separator className="h-[30%] w-px bg-border" />

          {walletStore.isWalletConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  role="button"
                  className="flex h-full items-center gap-2.5 rounded-full"
                >
                  <div className="size-11 rounded-[12px] border p-0.5">
                    <div className="size-full rounded-[10px] border bg-secondary">
                      <img
                        src={generateAvatarFromAddress(
                          credentialStore?.address as string,
                        )}
                        alt={credentialStore?.avatar}
                        width={48}
                        height={48}
                        className="rounded-[8px] object-contain"
                      />
                    </div>
                  </div>

                  <div className="hidden flex-col truncate md:mr-2 md:flex">
                    <div className="flex flex-1 items-center gap-2">
                      <p className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {credentialStore?.details?.name ?? "..."}
                      </p>
                      {credentialStore?.verified && (
                        <MdVerified className="mt-px size-4 text-primary" />
                      )}
                    </div>
                    {walletStore.walletAddress && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {truncateAddr(walletStore.walletAddress as string)}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="size-4" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="bottom"
                sideOffset={0}
                className="mr-5 w-[330px] rounded-2xl md:mr-6"
              >
                <DropdownMenuLabel className="flex items-center justify-between gap-4 p-2">
                  <div className="flex h-full flex-1 items-center gap-2.5 truncate">
                    <div className="size-11 rounded-[12px] border p-0.5">
                      <div className="size-full rounded-[10px] border bg-secondary">
                        <img
                          src={generateAvatarFromAddress(
                            credentialStore?.address as string,
                          )}
                          alt={credentialStore?.avatar}
                          width={48}
                          height={48}
                          className="rounded-[8px] object-contain"
                        />
                      </div>
                    </div>

                    <div className="line-clamp-1 flex flex-1 flex-col">
                      <div className="flex flex-1 items-center gap-2">
                        <p className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {credentialStore?.details?.name ?? "..."}
                        </p>
                        {credentialStore?.verified && (
                          <MdVerified className="mt-px size-4 text-primary" />
                        )}
                      </div>
                      {walletStore.walletAddress && (
                        <div className="flex items-center gap-2">
                          <span className="line-clamp-1 text-xs font-normal text-muted-foreground">
                            {truncateAddr(walletStore.walletAddress as string)}
                          </span>
                          <IoCopyOutline
                            onClick={() =>
                              copyToClipboard(
                                walletStore.walletAddress as string,
                              )
                            }
                            className="size-3"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="5 flex items-center gap-2">
                    {walletStore.hasRegistered && (
                      <DropdownMenuItem asChild>
                        <Button
                          onClick={() =>
                            navigate("/profile", {
                              state: credentialStore,
                            })
                          }
                          size="icon"
                          className="size-10 !rounded-[12px]"
                          variant={"outline"}
                          title="View Profile"
                          aria-label="View Profile"
                          aria-describedby="view-profile"
                        >
                          <RiUser6Line className="!size-4" />
                        </Button>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                      <Button
                        size="icon"
                        className="size-10 !rounded-[12px]"
                        variant={"outline"}
                        onClick={async () => await handleDisconnect()}
                        title="Disconnect Wallet"
                        aria-label="Disconnect Wallet"
                        aria-describedby="disconnect-wallet"
                      >
                        <LuLogOut className="!size-4" />
                      </Button>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {walletStore.hasRegistered ? (
                  <>
                    <div className="flex flex-col items-center justify-center gap-1 bg-secondary py-6">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Token Balance
                      </p>

                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            walletStore.selectedToken === "coiton"
                              ? "/coiton.svg"
                              : "/starknet.svg"
                          }
                          width={20}
                          height={20}
                        />
                        <p className="text-[22px] font-bold">0.00 STRK</p>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="flex items-center justify-between px-4 py-2">
                      <p className="text-sm font-medium">Switch Token</p>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="gap-1 rounded-xl pl-4 pr-3"
                            size="sm"
                          >
                            <span className="text-sm font-normal capitalize">
                              {walletStore.selectedToken}
                            </span>
                            <ChevronDown className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => dispatch(setSelectedToken("coiton"))}
                          >
                            Coiton
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              dispatch(setSelectedToken("starknet"))
                            }
                          >
                            Starknet
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 py-6">
                    <Button
                      className="px-7"
                      variant={"secondary"}
                      onClick={async () => navigate("/onboarding")}
                    >
                      Create an Account
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size={isMobile ? "icon" : "sm"}
              onClick={connectWallet}
              isLoading={isConnecting}
              txt="Signing in..."
              className="rounded-full"
            >
              <IoWalletOutline className="size-5" />
              <span className={cn(isMobile && "sr-only")}>Sign In</span>
            </Button>
          )}
        </div>
      </MaxWrapper>
    </div>
  );
};

export default memo(Navbar);
