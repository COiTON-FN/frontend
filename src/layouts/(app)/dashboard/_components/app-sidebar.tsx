import { memo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import {  useSelector } from "react-redux";
import { RootState } from "@/store";

const sidebarLinks = [
  {
    label: "Home",
    path: "/dashboard",
    icon: (className: string) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-6", className)}
      >
        <path
          d="M5 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5V15C22 15.5304 21.7893 16.0391 21.4142 16.4142C21.0391 16.7893 20.5304 17 20 17H19"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15L17 21H7L12 15Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    icon: (className: string) => (
      <svg
        className={cn("!size-[25px]", className)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.16405 11.3497L4 11.5587L4.45686 16.1005C4.715 18.6668 4.84407 19.9499 5.701 20.7249C6.55793 21.5 7.84753 21.5 10.4267 21.5H13.5733C16.1525 21.5 17.4421 21.5 18.299 20.7249C19.1559 19.9499 19.285 18.6668 19.5431 16.1005L20 11.5587L20.836 11.3497C21.5201 11.1787 22 10.564 22 9.85882C22 9.35735 21.7553 8.88742 21.3445 8.59985L13.1469 2.86154C12.4583 2.37949 11.5417 2.37949 10.8531 2.86154L2.65549 8.59985C2.24467 8.88742 2 9.35735 2 9.85882C2 10.564 2.47993 11.1787 3.16405 11.3497Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 16C14.2005 16.6224 13.1502 17 12 17C10.8498 17 9.79952 16.6224 9 16"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "Listings",
    path: "/listings",
  },
  {
    icon: (className: string) => (
      <svg
        className={cn("!size-[26px]", className)}
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.1673 17.3333V8.66667C15.1673 7.64529 15.1673 7.13461 14.85 6.8173C14.5327 6.5 14.022 6.5 13.0007 6.5C11.9793 6.5 11.4686 6.5 11.1513 6.8173C10.834 7.13461 10.834 7.64529 10.834 8.66667V17.3333C10.834 18.3547 10.834 18.8654 11.1513 19.1827C11.4686 19.5 11.9793 19.5 13.0007 19.5C14.022 19.5 14.5327 19.5 14.85 19.1827C15.1673 18.8654 15.1673 18.3547 15.1673 17.3333Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.7493 9.75033V7.58366C22.7493 6.56228 22.7493 6.0516 22.432 5.73429C22.1147 5.41699 21.604 5.41699 20.5827 5.41699C19.5613 5.41699 19.0506 5.41699 18.7333 5.73429C18.416 6.0516 18.416 6.56228 18.416 7.58366V9.75033C18.416 10.7717 18.416 11.2824 18.7333 11.5997C19.0506 11.917 19.5613 11.917 20.5827 11.917C21.604 11.917 22.1147 11.917 22.432 11.5997C22.7493 11.2824 22.7493 10.7717 22.7493 9.75033Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.58333 15.1663V12.9997C7.58333 11.9783 7.58333 11.4676 7.26604 11.1503C6.94873 10.833 6.43804 10.833 5.41667 10.833C4.39529 10.833 3.88461 10.833 3.5673 11.1503C3.25 11.4676 3.25 11.9783 3.25 12.9997V15.1663C3.25 16.1877 3.25 16.6984 3.5673 17.0157C3.88461 17.333 4.39529 17.333 5.41667 17.333C6.43804 17.333 6.94873 17.333 7.26604 17.0157C7.58333 16.6984 7.58333 16.1877 7.58333 15.1663Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 22.75V19.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.584 14.0837V11.917"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 6.5V3.25"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.584 5.41667V3.25"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.41602 19.4997V17.333"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.41602 10.8337V8.66699"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Trading",
    path: "/trading",
    },
    {
        label: "New Listings",
        path: "/new-listings",
        icon: (className: string) => (
            <svg className={cn("!size-[26px]", className)} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 14.5H3V21.5H10V14.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 3.5H3V10.5H10V3.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 4.5H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 9.5H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 15.5H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 20.5H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const walletState = useSelector((state: RootState) => state.wallet);

//   const [shouldShowBalance, setShouldShowBalance] = useState(true);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 md:p-6">
        <SidebarMenu className="px-2 py-2 md:px-4">
          <SidebarMenuItem>
            <Link className="flex w-max items-center gap-3" to="/">
              <img src="/coiton.svg" width={28} height={28} />
              <p className="text-lg font-medium">Coiton</p>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      {/* {walletState?.isWalletConnected && (
        <SidebarFooter>
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-t border-[#EAECF0] px-8 py-4">
              <p className="flex items-center gap-2 font-medium">
                <MdOutlineGeneratingTokens className="size-5" />
                <span>Tokens</span>
              </p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <p className="flex cursor-pointer items-center gap-1">
                    <span className="font-medium capitalize">
                      {walletState.selectedToken}
                    </span>
                    <ChevronDown className="size-4" />
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => dispatch(setSelectedToken("coiton"))}
                  >
                    Coiton
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => dispatch(setSelectedToken("starknet"))}
                  >
                    Starknet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-2 bg-[#F9FAFB] px-8 py-4">
              <p className="text-sm text-[#667085]">Balance</p>

              <div className="flex h-10 items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      walletState.selectedToken === "coiton"
                        ? "/coiton.svg"
                        : "/starknet.svg"
                    }
                    width={24}
                    height={24}
                  />
                  <p className="relative flex items-center gap-2 text-xl font-semibold text-primary">
                    {!shouldShowBalance ? (
                      <span className="mb-1 flex items-center">
                        xxx xxx xxx
                      </span>
                    ) : walletState.isWalletConnected ? (
                      true ? (
                        "0.00"
                      ) : (
                        <span className="font-satoshi">
                          {Number(walletState.walletBalance?.formatted)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      )
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
                <span onClick={() => setShouldShowBalance(!shouldShowBalance)}>
                  {!shouldShowBalance ? (
                    <EyeOff className="size-5 cursor-pointer text-muted-foreground" />
                  ) : (
                    <Eye className="size-5 cursor-pointer text-muted-foreground" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      )} */}
      <SidebarRail />
    </Sidebar>
  );
};

export default memo(AppSidebar);

export function NavMain() {
  const location = useLocation();
  const walletState = useSelector((state: RootState) => state.wallet);

  const isActive = (path?: string) => path && location.pathname.includes(path);

  return (
    <SidebarGroup className="pl-4">
      <SidebarMenu className="gap-2 md:pl-4">
        {sidebarLinks
          // .filter(
          //   (link) =>
          //     credentialStore?.accountType === "dao" || !link.dao_members,
          // )
          .map(({ label, path, icon }, _) =>

            <SidebarMenuItem key={label}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "relative h-14 font-medium rounded-none rounded-l-full p-0 pl-6 transition hover:bg-secondary",
                  {
                    "bg-[#e7fefc] text-primary hover:bg-[#dbfffc] hover:text-primary":
                      isActive(path),
                  },
                )}
                tooltip={label}
              >
                <Link
                  to={
                    path === "/profile"
                      ? `${path}/${walletState?.walletAddress}`
                      : (path as string)
                  }
                  className="flex items-center gap-4"
                >
                  {icon &&
                    icon(
                      isActive(path)
                        ? "stroke-[#056F67]"
                        : "stroke-muted-foreground group-hover:stroke-foreground transition-[stroke]",
                    )}
                  <span className="text-base tracking-wide">{label}</span>
                  {isActive(path) && (
                    <span className="absolute right-0 top-0 h-full w-1 bg-primary" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
