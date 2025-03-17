import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useWalletHook } from "@/hooks/useWallet.hook";
import { copyToClipboard, generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { RootState } from "@/store";
import { ChevronDown, Search, Wallet2 } from "lucide-react";
import { Fragment, memo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Plus, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BuyToken from "@/components/shared/buy-token";
import { RiShoppingCartLine } from "react-icons/ri";
import { TbCopy } from "react-icons/tb";

const Navbar = () => {
  const { handleDisconnect, handleConnectWallet } = useWalletHook();
  const navigate = useNavigate();

  const walletStore = useSelector((state: RootState) => state.wallet);
  const credentialStore = useSelector(
    (state: RootState) => state.credential.credential,
  );

  useEffect(() => {
    if (walletStore.isWalletConnected) {
      generateAvatarFromAddress(window.Wallet.Account?.address as string);
    }
  }, [walletStore.isWalletConnected])

  return (
    <div className="sticky left-0 top-0 z-30 h-20 w-full border-b border-[#EAECF0] bg-background/80 backdrop-blur-xl sm:bg-background sm:backdrop-blur-0">
      <div className="flex h-full items-center gap-6 px-5 md:px-6">
        <div className="flex h-full w-full max-w-sm items-center gap-3 xl:max-w-md">
          <SidebarTrigger className="rounded-full" />
          <Separator className="hidden h-[30%] w-px lg:flex" />
          <div className="relative hidden h-12 flex-1 rounded-full bg-secondary sm:h-14 lg:flex">
            <Search className="absolute left-4 top-1/2 size-6 -translate-y-1/2 text-muted-foreground/80" />
            <Input
              placeholder="Search"
              type="search"
              className="h-full flex-1 !rounded-full !pl-12 !text-base tracking-wide"
            />
          </div>
        </div>

        <div className="flex h-full flex-1 items-center justify-end gap-3">
          <Button
            size={"icon"}
            disabled
            variant={"outline"}
            className="rounded-full border border-[#d4d6da]"
          >
            <svg
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.7499 19C12.7499 19.1989 12.6709 19.3897 12.5303 19.5303C12.3896 19.671 12.1988 19.75 11.9999 19.75H5.99993C5.80102 19.75 5.61025 19.671 5.4696 19.5303C5.32895 19.3897 5.24993 19.1989 5.24993 19C5.24993 18.8011 5.32895 18.6103 5.4696 18.4697C5.61025 18.329 5.80102 18.25 5.99993 18.25H11.9999C12.1988 18.25 12.3896 18.329 12.5303 18.4697C12.6709 18.6103 12.7499 18.8011 12.7499 19ZM17.7984 16C17.6682 16.2292 17.4793 16.4196 17.2511 16.5514C17.0228 16.6833 16.7635 16.7518 16.4999 16.75H1.49993C1.23625 16.7496 0.977313 16.6798 0.749232 16.5475C0.521151 16.4151 0.331981 16.225 0.200788 15.9963C0.0695954 15.7676 0.00101624 15.5083 0.00196279 15.2446C0.00290934 14.9809 0.0733482 14.7222 0.20618 14.4944C0.726492 13.5981 1.49993 11.0631 1.49993 7.75C1.49993 5.76088 2.29011 3.85322 3.69663 2.4467C5.10315 1.04018 7.01081 0.25 8.99993 0.25C10.9891 0.25 12.8967 1.04018 14.3032 2.4467C15.7098 3.85322 16.4999 5.76088 16.4999 7.75C16.4999 11.0622 17.2743 13.5981 17.7946 14.4944C17.9288 14.7225 17.9997 14.9822 18.0002 15.2468C18.0007 15.5114 17.9307 15.7714 17.7974 16H17.7984ZM16.4999 15.25C15.7752 14.0059 14.9999 11.1297 14.9999 7.75C14.9999 6.1587 14.3678 4.63258 13.2426 3.50736C12.1174 2.38214 10.5912 1.75 8.99993 1.75C7.40863 1.75 5.88251 2.38214 4.75729 3.50736C3.63207 4.63258 2.99993 6.1587 2.99993 7.75C2.99993 11.1306 2.22368 14.0069 1.49993 15.25H16.4999Z"
                fill="#1D2939"
              />
            </svg>
          </Button>

          {walletStore.isWalletConnected ? (
            <Fragment>
              <BuyToken>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="rounded-full border border-[#d4d6da]"
                >
                  <RiShoppingCartLine className="size-5" />
                </Button>
              </BuyToken>
              <Separator className="h-[30%] w-px bg-[#EAECF0]" />

              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <div
                    role="button"
                    className="flex h-full items-center gap-2 rounded-full"
                  >
                    <span className="size-12 rounded-full border bg-background">
                      <img
                        src={credentialStore?.avatar}
                        alt={credentialStore?.avatar}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    </span>
                    {credentialStore?.details?.name ? <div className="hidden flex-col truncate md:flex">
                      <p className="font-medium">
                        {credentialStore?.details?.name}
                      </p>
                      <span className="text-sm font-normal text-muted-foreground">
                        {truncateAddr(walletStore.walletAddress as string)}
                      </span>
                    </div> : null}
                    <ChevronDown className="size-4 md:ml-2" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="bottom"
                  sideOffset={0}
                  className="mr-5 w-60 md:mr-6"
                >
                  <DropdownMenuLabel
                    onClick={() => {
                      copyToClipboard(walletStore.walletAddress as string);
                    }}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {truncateAddr(walletStore.walletAddress as string)}
                    </span>

                    <TbCopy role="button" className="size-5" />
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {walletStore.hasRegistered ? <DropdownMenuGroup>
                    <Link state={credentialStore} to={`/profile/${walletStore?.walletAddress}`}>
                      <DropdownMenuItem>
                        <User className="size-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                    {credentialStore?.user_type === "Entity" &&
                        <Link to="/list-property">
                            <DropdownMenuItem>
                                <Plus className="size-4" />
                                <span>List Property</span>
                                <DropdownMenuShortcut>⌘+L</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>
                    }
                  </DropdownMenuGroup> : <DropdownMenuItem onClick={async () => navigate("/onboarding")}>
                    {/* <LogOut className="size-4" /> */}
                    <span>Sign Up</span>
                    {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                  </DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => await handleDisconnect()}>
                    <LogOut className="size-4" />
                    <span>Disconnect</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Fragment>
          ) : (
            <Fragment>
              <Button
                variant={"black"}
                onClick={async () => {

                  if (window.Wallet?.IsConnected) {
                    await handleDisconnect()
                    return;
                  }

                  await handleConnectWallet();

                }
                }
                className="hidden rounded-full px-5 md:flex"
              >
                <Wallet2 className="size-4" />
                <span>Connect Wallet</span>
              </Button>
              <Button
                onClick={async () => {

                  if (window.Wallet?.IsConnected) {
                    await handleDisconnect()
                    return;
                  }

                  await handleConnectWallet();

                }
                }
                size={"icon"}
                variant={"black"}
                className="flex rounded-full md:hidden"
              >
                <Wallet2 className="!size-5" />
                <span className="sr-only">Connect Wallet</span>
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Navbar);
