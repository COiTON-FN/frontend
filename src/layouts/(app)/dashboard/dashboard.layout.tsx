import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/app-sidebar";
import Navbar from "./_components/navbar";
import MaxWrapper from "@/components/shared/max-wrapper";
import ScrollTop from "@/components/shared/scroll-top";

export default function DashboardLayout() {
  return (
    <SidebarProvider className="relative flex w-full flex-1">
      <AppSidebar />
      <ScrollTop />

      <main className="flex flex-1 flex-col sm:bg-secondary">
        <Navbar />
        <MaxWrapper>
          <Outlet />
        </MaxWrapper>
      </main>
    </SidebarProvider>
  );
}
