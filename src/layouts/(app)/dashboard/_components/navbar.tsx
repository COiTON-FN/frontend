import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn, generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { RootState } from "@/store";
import { ChevronDown } from "lucide-react";
import { Fragment, memo, useEffect, useState } from "react";
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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IoWalletOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { useWalletHook } from "@/hooks/useWallet.hook";
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
import { SearchInput } from "@/components/shared/search-input";
import { siteConfig } from "@/config/site.config";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const init = (key: string, def: string) => searchParams.get(key) ?? def;
  const [searchValue, setSearchValue] = useState<string>(init("search", ""));

  const isDark = theme === "dark";

  const navigate = useNavigate();

  const { handleDisconnect, handleConnectWallet, isConnecting } =
    useWalletHook();
  const isMobile = useIsMobileHook();

  const walletStore = useSelector((state: RootState) => state.wallet);
  const credentialStore = useSelector(
    (state: RootState) => state.credential.credential,
  );

  useEffect(() => {
    if (walletStore.isWalletConnected) {
      generateAvatarFromAddress(credentialStore?.address as string);
    }
  }, [credentialStore?.address, walletStore.isWalletConnected]);

  const connectWallet = async () => {
    try {
      if (window.Wallet?.IsConnected) return;
      await handleConnectWallet();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.info(error.message);
      } else {
        toast.info(String(error));
      }
    }
  };

  return (
    <div className="sticky left-0 top-0 z-30 h-20 w-full border-b border-[#EAECF0] bg-background/80 backdrop-blur-xl dark:border-border sm:bg-background sm:backdrop-blur-0">
      <MaxWrapper className="flex h-full items-center gap-6">
        <div className="flex h-full w-full max-w-sm items-center gap-3 xl:max-w-md">
          <SidebarTrigger className="rounded-full" />
          <Separator className="hidden h-[30%] w-px lg:flex" />
          <SearchInput
            placeholder="Search property by title or owner"
            className="hidden flex-1 lg:flex"
            value={searchValue}
            onValueChange={setSearchValue}
          />
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
                        alt={credentialStore?.avatar}
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
                          onClick={async () => await handleDisconnect()}
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
              isLoading={isConnecting}
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
