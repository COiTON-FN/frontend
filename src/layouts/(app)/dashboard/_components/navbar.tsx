import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn, generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { RootState, useAppDispatch } from "@/store";
import { ChevronDown, Search } from "lucide-react";
import { Fragment, memo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { IoWalletOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { MdVerified } from "react-icons/md";
import MaxWrapper from "@/components/shared/max-wrapper";
import { useIsMobileHook } from "@/hooks/useMobile.hook";
import Notifications from "./notifications";
import { IoInvertMode } from "react-icons/io5";
import { PiChatsCircle, PiWarningCircle } from "react-icons/pi";
import { AiOutlineLogout } from "react-icons/ai";
import { RiLink } from "react-icons/ri";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ClipboardCopy } from "@/components/shared/clipboard-copy";
import { useTheme } from "@/components/provider/theme.provider";
import { siteConfig } from "@/config/site.config";
import { GlobalSearch } from "@/components/shared/global-search";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { setCurrentConnector, setIsWalletConnected, setWalletAddress } from "@/store/slice/wallet.slice";
import { setCredential } from "@/store/slice/credential.slice";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { connectAsync, connectors, isPending } = useConnect()
  const { account, address } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const isDark = theme === "dark";

  const navigate = useNavigate();

  const isMobile = useIsMobileHook();

  const walletStore = useSelector((state: RootState) => state.wallet);
  const credentialStore = useSelector(
    (state: RootState) => state.credential.credential,
  );
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (walletStore.isWalletConnected) {
      generateAvatarFromAddress(credentialStore?.address as string);
    }
  }, [credentialStore?.address, walletStore.isWalletConnected]);

  const connectWallet = async () => {
    try {
      if (window.Wallet?.IsConnected) return;
      await connectAsync({ connector: connectors[0] });

    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.info(error.message);
      } else {
        toast.info(String(error));
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync()
      dispatch(setCurrentConnector(null));
      dispatch(setIsWalletConnected(false));
      dispatch(setCredential(null));
      window.Wallet = { Account: undefined, IsConnected: false };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.info(error.message);
      } else {
        toast.info(String(error));
      }
    }
  }

  useEffect(() => {
    (function () {
      if (!address) return;
      if (window.Wallet?.Account) return;
      dispatch(setIsWalletConnected(true));
      dispatch(setWalletAddress(address?.toString()));
      window.Wallet = {
        Account: account,
        IsConnected: true,
      };
    }())
  }, [connectors, account])

  return (
    <div className="sticky left-0 top-0 z-30 h-20 w-full border-b border-[#EAECF0] bg-background/80 backdrop-blur-xl dark:border-border sm:bg-background sm:backdrop-blur-0">
      <MaxWrapper className="flex h-full items-center gap-6">
        <div className="flex h-full max-w-sm flex-1 items-center gap-3 xl:max-w-md">
          <SidebarTrigger className="rounded-full" />
          <Separator className="hidden h-[30%] w-px lg:flex" />

          <GlobalSearch>
            <div className="relative flex h-11 w-max items-center gap-3 rounded-full border px-3 xl:h-14 xl:px-4">
              <Search className="size-[21px] text-muted-foreground" />
              <p className="hidden font-normal text-muted-foreground xl:flex">
                Search for people and listings...
              </p>

              <kbd className="pointer-events-none ml-4 inline-flex h-5 select-none items-center gap-1 rounded bg-neutral-100 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 dark:bg-neutral-800 xl:ml-6">
                <span className="mt-px text-sm">⌘</span>J
              </kbd>
            </div>
          </GlobalSearch>
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
                  <div className="size-11 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-[2.5px]">
                    <div className="size-full rounded-full bg-background p-[2.5px]">
                      <img
                        src={generateAvatarFromAddress(
                          credentialStore?.address as string,
                        )}
                        alt={credentialStore?.address}
                        width={48}
                        height={48}
                        className="rounded-full object-contain"
                      />
                    </div>
                  </div>

                  <ChevronDown className="size-4" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="bottom"
                sideOffset={-4}
                className="mr-5 w-[290px] rounded-3xl p-2 sm:w-[280px] md:mr-6"
              >
                {walletStore.hasRegistered && (
                  <Fragment>
                    <DropdownMenuLabel className="flex items-center justify-between gap-4 px-2 pt-1">
                      <div className="flex w-full items-center gap-2.5 rounded-full">
                        <div className="size-11 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-[2.5px]">
                          <div className="size-full rounded-full bg-background p-[2.5px]">
                            <img
                              src={generateAvatarFromAddress(
                                credentialStore?.address as string,
                              )}
                              alt={credentialStore?.avatar}
                              width={48}
                              height={48}
                              className="rounded-full object-contain"
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
                          {credentialStore?.address && (
                            <ClipboardCopy
                              size={14}
                              className="gap-1"
                              value={credentialStore?.address}
                              message="Wallet address copied successfully"
                            >
                              <span className="line-clamp-1 text-xs font-normal text-muted-foreground">
                                {truncateAddr(
                                  credentialStore?.address as string,
                                )}
                              </span>
                            </ClipboardCopy>
                          )}
                        </div>

                        <DropdownMenuItem asChild>
                          <Link
                            to="https://web.ready.co/"
                            target="_blank"
                            title="Argent Profile"
                            aria-label="Argent Profile"
                            aria-describedby="argent-profile"
                            className={buttonVariants({
                              size: "icon",
                              className: "!size-10 !rounded-[14px]",
                              variant: "outline",
                            })}
                          >
                            <RiLink className="!size-4" />
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                  </Fragment>
                )}

                {!walletStore.hasRegistered && (
                  <Fragment>
                    <DropdownMenuItem
                      onClick={() => navigate("/onboarding")}
                      className="gap-3 !rounded-2xl"
                    >
                      <HiOutlineUser className="!size-[19px]" />
                      <span>Create an Account</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                  </Fragment>
                )}

                <DropdownMenuGroup>
                  {walletStore.hasRegistered && (
                    <DropdownMenuItem
                      onClick={() =>
                        navigate("/profile", {
                          state: credentialStore,
                        })
                      }
                      className="gap-3 !rounded-2xl"
                    >
                      <HiOutlineUser className="!size-[19px]" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="gap-3 !rounded-2xl"
                    asChild
                    title="Join the Telegram community"
                  >
                    <Link
                      to={siteConfig.social.telegram}
                      target="_blank"
                      title="Join the Telegram community"
                    >
                      <PiChatsCircle className="!size-[19px]" />
                      <span>Community</span>
                    </Link>
                  </DropdownMenuItem>

                  <Label
                    htmlFor="mode-toggle"
                    className="relative flex h-11 cursor-pointer select-none items-center gap-3 rounded-2xl px-3 text-sm font-normal outline-none transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-neutral-900 dark:hover:text-foreground"
                  >
                    <IoInvertMode className="size-[19px]" />
                    <span>Dark Theme</span>
                    <Switch
                      id="mode-toggle"
                      checked={isDark}
                      onCheckedChange={(value) =>
                        setTheme(value ? "dark" : "light")
                      }
                      className="ml-auto"
                    />
                  </Label>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="gap-3 !rounded-2xl" asChild>
                    <div>
                      <PiWarningCircle className="!size-[19px]" />
                      <span>Help Center</span>
                    </div>
                  </DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative flex h-11 cursor-pointer select-none items-center gap-3 !rounded-2xl px-3 text-sm text-destructive outline-none transition-colors hover:bg-destructive/5 [&_svg]:shrink-0">
                        <AiOutlineLogout className="!size-[19px]" />
                        <span>Sign Out</span>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm !rounded-3xl !p-6">
                      <DialogHeader>
                        <DialogTitle className="mb-1">
                          Already leaving?
                        </DialogTitle>
                        <DialogDescription>
                          You won't be able to use the dApp to make any
                          transactions after signing out. Wish to proceed?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant={"outline"} className="px-6">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          className="flex-1"
                          onClick={handleDisconnect}
                        >
                          Yes, Sign Out!
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size={isMobile ? "icon" : "sm"}
              onClick={connectWallet}
              isLoading={isPending}
              txt={!isMobile ? "Please wait..." : undefined}
              className="rounded-full"
            >
              <IoWalletOutline className="size-4" />
              <span className={cn(isMobile && "sr-only")}>Sign In</span>
            </Button>
          )}
        </div>
      </MaxWrapper>
    </div>
  );
};

export default memo(Navbar);
