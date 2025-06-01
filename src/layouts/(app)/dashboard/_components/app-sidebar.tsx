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
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const sidebarLinks = [
  {
    label: "Home",
    path: "/dashboard",
    icon: (className: string) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-6", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z"
          strokeWidth="1.7"
        />
        <path
          d="M21 9L3 9"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 21L9 9"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Add Property",
    path: "/list-property",
    icon: (className: string) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-6", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
    onlyFor: "Entity",
  },
  {
    label: "Properties",
    path: "/listings",
    icon: (className: string) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-[25px]", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M21.6359 12.9579L21.3572 14.8952C20.8697 18.2827 20.626 19.9764 19.451 20.9882C18.2759 22 16.5526 22 13.1061 22H10.8939C7.44737 22 5.72409 22 4.54903 20.9882C3.37396 19.9764 3.13025 18.2827 2.64284 14.8952L2.36407 12.9579C1.98463 10.3208 1.79491 9.00229 2.33537 7.87495C2.87583 6.7476 4.02619 6.06234 6.32691 4.69181L7.71175 3.86687C9.80104 2.62229 10.8457 2 12 2C13.1543 2 14.199 2.62229 16.2882 3.86687L17.6731 4.69181C19.9738 6.06234 21.1242 6.7476 21.6646 7.87495"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Requests",
    path: "/requests",
    icon: (className: string) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-6", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M19 16C19 18.8284 19 20.2426 18.1213 21.1213C17.2426 22 15.8284 22 13 22H11C8.17157 22 6.75736 22 5.87868 21.1213C5 20.2426 5 18.8284 5 16V12M5 8C5 5.17157 5 3.75736 5.87868 2.87868C6.75736 2 8.17157 2 11 2H13C15.8284 2 17.2426 2 18.1213 2.87868C19 3.75736 19 5.17157 19 8V12"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M5 4.07617C4.02491 4.17208 3.36857 4.38885 2.87868 4.87873C2 5.75741 2 7.17163 2 10.0001V14.0001C2 16.8285 2 18.2427 2.87868 19.1214C3.36857 19.6113 4.02491 19.828 5 19.9239"
          strokeWidth="1.7"
        />
        <path
          d="M19 4.07617C19.9751 4.17208 20.6314 4.38885 21.1213 4.87873C22 5.75741 22 7.17163 22 10.0001V14.0001C22 16.8285 22 18.2427 21.1213 19.1214C20.6314 19.6113 19.9751 19.828 19 19.9239"
          strokeWidth="1.7"
        />
        <path d="M9 13H15" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M9 9H15" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M9 17H12" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Accounts",
    path: "/users",
    icon: (className: string) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-6", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="6" r="4" strokeWidth="1.7" />
        <path
          d="M18 9C19.6569 9 21 7.88071 21 6.5C21 5.11929 19.6569 4 18 4"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M6 9C4.34315 9 3 7.88071 3 6.5C3 5.11929 4.34315 4 6 4"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M17.1973 15C17.7078 15.5883 18 16.2714 18 17C18 19.2091 15.3137 21 12 21C8.68629 21 6 19.2091 6 17C6 14.7909 8.68629 13 12 13C12.3407 13 12.6748 13.0189 13 13.0553"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M20 19C21.7542 18.6153 23 17.6411 23 16.5C23 15.3589 21.7542 14.3847 20 14"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M4 19C2.24575 18.6153 1 17.6411 1 16.5C1 15.3589 2.24575 14.3847 4 14"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
    onlyFor: "Owner",
  },
  {
    label: "Trade Center",
    path: "/trading",
    icon: (className: string) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-6", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4.75 17.4V6.6C4.75 5.1 5.39 4.5 6.98 4.5H8.02C9.61 4.5 10.25 5.1 10.25 6.6V17.4C10.25 18.9 9.61 19.5 8.02 19.5H6.98C5.39 19.5 4.75 18.9 4.75 17.4Z"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.25 15.4V8.6C13.25 7.1 13.89 6.5 15.48 6.5H16.52C18.11 6.5 18.75 7.1 18.75 8.6V15.4C18.75 16.9 18.11 17.5 16.52 17.5H15.48C13.89 17.5 13.25 16.9 13.25 15.4Z"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12H4.4"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 12H13"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 12H19.31"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
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
      <SidebarRail />
    </Sidebar>
  );
};

export default memo(AppSidebar);

export function NavMain() {
  const location = useLocation();
  const walletAddress = useSelector(
    (state: RootState) => state.wallet.walletAddress,
  );
  const contractOwner = useSelector(
    (state: RootState) => state.wallet.contractOwner,
  );
  const credential = useSelector(
    (state: RootState) => state.credential.credential,
  );

  const isContractOwner =
    String(credential?.address).toLowerCase() ===
    String(contractOwner).toLowerCase();

  const isActive = (path?: string) => path && location.pathname.includes(path);

  const filteredLinks = sidebarLinks.filter((link) => {
    // if (link.onlyFor === "Entity" && credential?.user_type !== "Entity")
    //   return false;
    if (link.onlyFor === "Entity" && !credential?.verified) return false;
    if (link.onlyFor === "Owner" && !isContractOwner) return false;
    return true;
  });

  return (
    <SidebarGroup className="pl-4">
      <SidebarMenu className="gap-2 md:pl-4">
        {filteredLinks.map(({ label, path, icon }, index) => {
          const active = isActive(path);
          const toPath =
            path === "/profile" ? `${path}/${walletAddress}` : path || "";

          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "group relative h-14 rounded-none rounded-l-full p-0 pl-6 font-medium transition hover:bg-secondary",
                  active &&
                    "bg-[#e7fefc] text-primary hover:bg-[#dbfffc] hover:text-primary",
                )}
                tooltip={label}
              >
                <Link to={toPath} className="flex items-center gap-4">
                  {icon?.(
                    active
                      ? "stroke-[#056F67] stroke-2"
                      : "stroke-muted-foreground transition-[stroke]",
                  )}
                  <span
                    className={cn(
                      "text-base font-normal tracking-wide",
                      active && "font-medium",
                    )}
                  >
                    {label}
                  </span>
                  {active && (
                    <span className="absolute right-0 top-0 h-full w-1 bg-primary" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
