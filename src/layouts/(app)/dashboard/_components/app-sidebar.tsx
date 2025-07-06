import { Fragment, memo } from "react";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
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
    label: "Dashboard",
    path: "/dashboard",
    icon: (className: string) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-[26px]", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z"
          stroke-width="1.7"
        />
        <path
          d="M21 9L3 9"
          stroke-width="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 21L9 9"
          stroke-width="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Properties",
    path: "/properties",
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
    label: "About Us",
    path: "/about",
    icon: (className: string) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("!size-6", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M3 10V14C3 15.8856 3 16.8284 3.58579 17.4142C4.17157 18 5.11438 18 7 18H17C18.8856 18 19.8284 18 20.4142 17.4142C21 16.8284 21 15.8856 21 14V9C21 6.17157 21 4.75736 20.1213 3.87868C19.2426 3 17.8284 3 15 3H9C6.17157 3 4.75736 3 3.87868 3.87868C3.38879 4.36857 3.17203 5.02491 3.07612 6"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path d="M22 21H16M2 21H12" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M15 15H9" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
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
          d="M4 9V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.8C20 17.9201 20 18.4802 19.782 18.908C19.5903 19.2843 19.2843 19.5903 18.908 19.782C18.4802 20 17.9201 20 16.8 20H10.5M11 16H17M8 11L11 9V12L17 7M17 7H14M17 7V10M7 14.5C6.5 14.376 5.68509 14.3714 5 14.376C4.77091 14.3775 4.90941 14.3678 4.6 14.376C3.79258 14.4012 3.00165 14.7368 3 15.6875C2.99825 16.7004 4 17 5 17C6 17 7 17.2312 7 18.3125C7 19.1251 6.1925 19.4812 5.1861 19.5991C4.3861 19.5991 4 19.625 3 19.5M5 20V21M5 13V14"
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
      <SidebarHeader className="py-4 md:p-6">
        <SidebarMenu className="px-2 py-2 md:px-4">
          <SidebarMenuItem>
            <Link className="flex w-max items-center gap-3" to="/">
              <img src="/coiton.svg" width={28} height={28} />
              <p className="text-lg font-medium dark:text-foreground">Coiton</p>
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
    if (link.onlyFor === "Entity" && credential?.user_type !== "Entity")
      return false;
    return true;
  });

  return (
    <SidebarMenu className="gap-2 md:!pl-10">
      {filteredLinks.map(({ label, path, icon }, index) => {
        const active = isActive(path);
        const toPath =
          path === "/profile" ? `${path}/${walletAddress}` : path || "";

        return (
          <motion.div
            key={index}
            variants={{
              initial: { opacity: 0, y: 100 },
              animate: (index: number) => ({
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.05 * index,
                  duration: 0.9,
                  type: "spring",
                },
              }),
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "group relative h-14 rounded-none rounded-l-full !p-0 !pl-6 font-medium text-muted-foreground transition hover:bg-secondary active:text-muted-foreground dark:hover:bg-neutral-900",
                  active &&
                    "bg-[#e7fefc] text-primary hover:bg-[#dbfffc] hover:text-primary dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/10",
                  !active && "hover:text-foreground/60",
                )}
                tooltip={label}
              >
                <Link to={toPath} className="flex items-center gap-4">
                  {icon?.(
                    active
                      ? "stroke-primary stroke-2"
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
          </motion.div>
        );
      })}

      {isContractOwner && (
        <Fragment>
          <motion.p
            variants={{
              initial: { opacity: 0, y: 100 },
              animate: (index: number) => ({
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.05 * index,
                  duration: 0.9,
                  type: "spring",
                },
              }),
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={filteredLinks.length}
            className="ml-6 mt-6 text-sm tracking-wide text-muted-foreground"
          >
            Administration
          </motion.p>
          <motion.div
            variants={{
              initial: { opacity: 0, y: 100 },
              animate: (index: number) => ({
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.05 * index,
                  duration: 0.9,
                  type: "spring",
                },
              }),
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={filteredLinks.length}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "group relative h-14 rounded-none rounded-l-full !p-0 !pl-6 font-medium text-muted-foreground transition hover:bg-secondary active:text-muted-foreground dark:hover:bg-neutral-900",
                  isActive("/users") &&
                    "bg-[#e7fefc] text-primary hover:bg-[#dbfffc] hover:text-primary dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/10",
                  !isActive("/users") && "hover:text-foreground/60",
                )}
                tooltip="Accounts"
              >
                <Link to="/users" className="flex items-center gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(
                      "!size-6 stroke-muted-foreground transition-[stroke]",
                      {
                        "stroke-[#056F67] stroke-2": isActive("/users"),
                      },
                    )}
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
                  <span
                    className={cn(
                      "text-base font-normal tracking-wide",
                      isActive("/users") && "font-medium",
                    )}
                  >
                    Accounts
                  </span>
                  {isActive("/users") && (
                    <span className="absolute right-0 top-0 h-full w-1 bg-primary" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </motion.div>
        </Fragment>
      )}
    </SidebarMenu>
  );
}
