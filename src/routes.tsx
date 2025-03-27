import { createBrowserRouter } from "react-router-dom";
import { layouts } from "./layouts";
import { pages } from "./pages";

export const routes = createBrowserRouter([
  {
    element: layouts.landingLayout,
    children: [
      {
        path: "/",
        element: pages.homePage,
      },
    ],
  },
  {
    element: layouts.dashboardLayout,
    children: [
      {
        path: "/dashboard",
        element: pages.dashboardPage,
      },
      {
        path: "/profile/:address",
        element: pages.profilePage,
      },
      {
        path: "/approve",
        element: pages.approveBidPage,
      },
      {
        path: "/requests",
        element: pages.requestsPage,
      },
      {
        path: "/list-property",
        element: pages.listPropertyPage,
      },
      {
        path: "/listing/:id",
        element: pages.propertyDetailsPage,
      },
      {
        path: "/listings",
        element: pages.listingsPage,
      },
      {
        path: "/trading",
        element: pages.tradingPage,
      },
    ],
  },
  {
    path: "/onboarding",
    element: layouts.onboardingLayout,
    children: [
      {
        path: "/onboarding",
        element: pages.onboardingPage,
      },
      {
        path: "property-management",
        element: pages.propertyManagementPage,
      },
      {
        path: "get-verified",
        element: pages.getVerifiedPage,
      },
    ],
  },
]);
