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
        path: "/new-listing",
        element: pages.listPropertyPage,
      },
      {
        path: "/listing/:id",
        element: pages.propertyDetailsPage,
      },
      {
        path: "/listings",
        element: pages.buyOrRentPage,
      },
      // {
      //   path: "/governance",
      //   element: pages.governancePage,
      // },
      {
        path: "/trading",
        element: pages.tradingPage,
      },
      // {
      //   element: layouts.proposalsLayout,
      //   children: [
      //     {
      //       path: "/proposals",
      //       element: pages.proposalsPage,
      //     },
      //     {
      //       path: "/proposals/new",
      //       element: pages.newProposalPage,
      //     },
      //   ],
      // },
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
