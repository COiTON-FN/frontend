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
        path: "/profile",
        element: pages.profilePage,
      },
      {
        path: "/list-property",
        element: pages.listPropertyPage,
      },
      {
        path: "/properties",
        element: pages.listingsPage,
      },
      {
        path: "/properties/:id",
        element: pages.propertyDetailsPage,
      },
      {
        path: "/trading",
        element: pages.tradingPage,
      },
      {
        path: "/users",
        element: pages.usersPage,
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
        path: "individual",
        element: pages.individualForm,
      },
      {
        path: "entity",
        element: pages.entityForm,
      },
    ],
  },
]);
