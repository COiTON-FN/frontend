import { memo, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { MdOutlineGeneratingTokens } from "react-icons/md";
import { setSelectedToken } from "@/store/slice/wallet.slice";

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
    // label: "Property Management",
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
    // sub_labels: [
    //   {
    //     label: "Buy/Rent",
    //     path: "/buy-rent",
    //     icon: (className: string) => (
    //       <svg
    //         className={cn("!size-[18px]", className)}
    //         viewBox="0 0 19 18"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           d="M2 8.55C2 7.68127 2.1813 7.5 3.05 7.5H15.95C16.8187 7.5 17 7.68127 17 8.55V9.45C17 10.3187 16.8187 10.5 15.95 10.5H3.05C2.1813 10.5 2 10.3187 2 9.45V8.55Z"
    //           strokeWidth="1.2"
    //           strokeLinecap="round"
    //         />
    //         <path
    //           d="M2 2.55C2 1.6813 2.1813 1.5 3.05 1.5H15.95C16.8187 1.5 17 1.6813 17 2.55V3.45C17 4.3187 16.8187 4.5 15.95 4.5H3.05C2.1813 4.5 2 4.3187 2 3.45V2.55Z"
    //           strokeWidth="1.2"
    //           strokeLinecap="round"
    //         />
    //         <path
    //           d="M2 14.55C2 13.6813 2.1813 13.5 3.05 13.5H15.95C16.8187 13.5 17 13.6813 17 14.55V15.45C17 16.3187 16.8187 16.5 15.95 16.5H3.05C2.1813 16.5 2 16.3187 2 15.45V14.55Z"
    //           strokeWidth="1.2"
    //           strokeLinecap="round"
    //         />
    //       </svg>
    //     ),
    //   },
    //   {
    //     label: "List a Property",
    //     path: "/new-listing",
    //     icon: (className: string) => (
    //       <svg
    //         className={cn("!size-[18px]", className)}
    //         viewBox="0 0 18 18"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           d="M1.5 9C1.5 5.81802 1.5 4.22703 2.37868 3.23851C3.25736 2.25 4.67157 2.25 7.5 2.25H10.5C13.3284 2.25 14.7427 2.25 15.6213 3.23851C16.5 4.22703 16.5 5.81802 16.5 9C16.5 12.1819 16.5 13.773 15.6213 14.7615C14.7427 15.75 13.3284 15.75 10.5 15.75H7.5C4.67157 15.75 3.25736 15.75 2.37868 14.7615C1.5 13.773 1.5 12.1819 1.5 9Z"
    //           strokeWidth="1.2"
    //         />
    //         <path
    //           d="M1.5 6.75H7.5C9.6213 6.75 10.6819 6.75 11.341 7.40901C12 8.06805 12 9.1287 12 11.25V15.75"
    //           strokeWidth="1.2"
    //         />
    //         <path d="M7.5 15.75V6.75" strokeWidth="1.2" />
    //       </svg>
    //     ),
    //   },
    // ],
  },
  // {
  //   label: "DAO  Governance",
  //   icon: (className: string) => (
  //     <svg
  //       className={cn("!size-[26px]", className)}
  //       viewBox="0 0 26 26"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path
  //         d="M7.58464 2.16699C4.5931 2.16699 2.16797 4.59212 2.16797 7.58366C2.16797 9.58859 3.25726 11.3391 4.8763 12.2757V19.3304C4.8763 20.216 4.8763 20.6588 5.04123 21.057C5.20616 21.4552 5.51927 21.7683 6.1455 22.3946L7.58464 23.8337L9.86851 21.5498C9.97384 21.4445 10.0265 21.3917 10.0702 21.3346C10.185 21.1846 10.2585 21.0071 10.2835 20.8198C10.293 20.7485 10.293 20.674 10.293 20.5251C10.293 20.4045 10.293 20.3442 10.2866 20.2856C10.2698 20.132 10.2204 19.9838 10.1417 19.8509C10.1117 19.8002 10.0755 19.752 10.0031 19.6556L8.66797 17.8753L9.4263 16.8643C9.85583 16.2915 10.0706 16.0052 10.1818 15.6716C10.293 15.3381 10.293 14.9801 10.293 14.2643V12.2757C11.912 11.3391 13.0013 9.58859 13.0013 7.58366C13.0013 4.59212 10.5762 2.16699 7.58464 2.16699Z"
  //         strokeWidth="1.625"
  //         strokeLinejoin="round"
  //       />
  //       <path
  //         d="M7.58203 7.58301H7.59251"
  //         strokeWidth="2.16667"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       />
  //       <path
  //         d="M14.082 15.167H20.582C21.5916 15.167 22.0963 15.167 22.4945 15.3319C23.0254 15.5518 23.4472 15.9736 23.6671 16.5045C23.832 16.9027 23.832 17.4074 23.832 18.417C23.832 19.4266 23.832 19.9313 23.6671 20.3295C23.4472 20.8603 23.0254 21.2822 22.4945 21.5021C22.0963 21.667 21.5916 21.667 20.582 21.667H14.082"
  //         strokeWidth="1.625"
  //         strokeLinecap="round"
  //       />
  //       <path
  //         d="M16.25 5.41699H20.5833C21.5929 5.41699 22.0976 5.41699 22.4959 5.58192C23.0267 5.80182 23.4485 6.22362 23.6684 6.75451C23.8333 7.15269 23.8333 7.65746 23.8333 8.66699C23.8333 9.67653 23.8333 10.1813 23.6684 10.5795C23.4485 11.1103 23.0267 11.5322 22.4959 11.7521C22.0976 11.917 21.5929 11.917 20.5833 11.917H16.25"
  //         strokeWidth="1.625"
  //         strokeLinecap="round"
  //       />
  //     </svg>
  //   ),
  //   sub_labels: [
  //     {
  //       icon: (className: string) => (
  //         <svg
  //           className={cn("!size-[18px]", className)}
  //           viewBox="0 0 19 18"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             d="M2 8.55C2 7.68127 2.1813 7.5 3.05 7.5H15.95C16.8187 7.5 17 7.68127 17 8.55V9.45C17 10.3187 16.8187 10.5 15.95 10.5H3.05C2.1813 10.5 2 10.3187 2 9.45V8.55Z"
  //             strokeWidth="1.2"
  //             strokeLinecap="round"
  //           />
  //           <path
  //             d="M2 2.55C2 1.6813 2.1813 1.5 3.05 1.5H15.95C16.8187 1.5 17 1.6813 17 2.55V3.45C17 4.3187 16.8187 4.5 15.95 4.5H3.05C2.1813 4.5 2 4.3187 2 3.45V2.55Z"
  //             strokeWidth="1.2"
  //             strokeLinecap="round"
  //           />
  //           <path
  //             d="M2 14.55C2 13.6813 2.1813 13.5 3.05 13.5H15.95C16.8187 13.5 17 13.6813 17 14.55V15.45C17 16.3187 16.8187 16.5 15.95 16.5H3.05C2.1813 16.5 2 16.3187 2 15.45V14.55Z"
  //             strokeWidth="1.2"
  //             strokeLinecap="round"
  //           />
  //         </svg>
  //       ),
  //       label: "DOA Listings",
  //       path: "/governance",
  //     },
  //     {
  //       icon: (className: string) => (
  //         <svg
  //           className={cn("!size-[18px]", className)}
  //           viewBox="0 0 18 18"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             d="M1.5 9C1.5 5.81802 1.5 4.22703 2.37868 3.23851C3.25736 2.25 4.67157 2.25 7.5 2.25H10.5C13.3284 2.25 14.7427 2.25 15.6213 3.23851C16.5 4.22703 16.5 5.81802 16.5 9C16.5 12.1819 16.5 13.773 15.6213 14.7615C14.7427 15.75 13.3284 15.75 10.5 15.75H7.5C4.67157 15.75 3.25736 15.75 2.37868 14.7615C1.5 13.773 1.5 12.1819 1.5 9Z"
  //             strokeWidth="1.2"
  //           />
  //           <path
  //             d="M1.5 6.75H7.5C9.6213 6.75 10.6819 6.75 11.341 7.40901C12 8.06805 12 9.1287 12 11.25V15.75"
  //             strokeWidth="1.2"
  //           />
  //           <path d="M7.5 15.75V6.75" strokeWidth="1.2" />
  //         </svg>
  //       ),
  //       label: "Proposals",
  //       path: "/proposals",
  //     },
  //   ],
  //   dao_members: true,
  // },
  // {
  //   icon: (className: string) => (
  //     <svg
  //       className={cn("!size-6", className)}
  //       viewBox="0 0 19 19"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path
  //         d="M9.50065 17.4168C13.8729 17.4168 17.4173 13.8724 17.4173 9.50016C17.4173 5.12791 13.8729 1.5835 9.50065 1.5835C5.1284 1.5835 1.58398 5.12791 1.58398 9.50016C1.58398 13.8724 5.1284 17.4168 9.50065 17.4168Z"
  //         strokeWidth="1.2"
  //       />
  //       <path
  //         d="M5.9375 13.4582C7.78343 11.5248 11.1967 11.4337 13.0625 13.4582M11.4753 7.52067C11.4753 8.61372 10.5879 9.49984 9.49327 9.49984C8.39871 9.49984 7.51131 8.61372 7.51131 7.52067C7.51131 6.42761 8.39871 5.5415 9.49327 5.5415C10.5879 5.5415 11.4753 6.42761 11.4753 7.52067Z"
  //         strokeWidth="1.2"
  //         strokeLinecap="round"
  //       />
  //     </svg>
  //   ),
  //   label: "Profile",
  //   path: "/profile",
  // },
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
  // {
  //   icon: (className: string) => (
  //     <svg
  //       className={cn("!size-6", className)}
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <path
  //         d="M10 14H3V21H10V14Z"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       />
  //       <path
  //         d="M10 3H3V10H10V3Z"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       />
  //       <path
  //         d="M14 4H21"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       />
  //       <path
  //         d="M14 9H21"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       />
  //       <path
  //         d="M14 15H21"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       />
  //       <path
  //         d="M14 20H21"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       />
  //     </svg>
  //   ),
  //   label: "Transaction history",
  //   path: "/transaction-history",
  // },
];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const dispatch = useDispatch<AppDispatch>();
  const walletState = useSelector((state: RootState) => state.wallet);



  const [shouldShowBalance, setShouldShowBalance] = useState(true);

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
      {walletState?.isWalletConnected && (
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
      )}
      <SidebarRail />
    </Sidebar>
  );
};

export default memo(AppSidebar);

export function NavMain() {
  const location = useLocation();
  const walletState = useSelector((state: RootState) => state.wallet);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isActive = (path?: string) => path && location.pathname.includes(path);

  return (
    <SidebarGroup className="pl-4">
      <SidebarMenu className="gap-2 md:pl-4">
        {sidebarLinks
          // .filter(
          //   (link) =>
          //     credentialStore?.accountType === "dao" || !link.dao_members,
          // )
          .map(({ label, path, icon }, index) =>

            <SidebarMenuItem key={label}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "relative h-14 rounded-none rounded-l-full p-0 pl-6 transition hover:bg-secondary",
                  {
                    "bg-[#e7fefc] font-medium text-primary hover:bg-[#dbfffc] hover:text-primary":
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
                  <span className="text-base md:text-lg">{label}</span>
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
