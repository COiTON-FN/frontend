import BidPage from "./(app)/bid/bid.page";
import BuyOrRentPage from "./(app)/buy-or-rent/buy-or-rent.page";
import DashboardPage from "./(app)/dashboard/dashboard.page";
import ListPropertyPage from "./(app)/list-property/list-property.page";
import NewListingsPage from "./(app)/new-listings/new-listings.page";
import GetVerifiedPage from "./(app)/onboarding/account-type/get-verified.page";
import PropertyManagementPage from "./(app)/onboarding/account-type/property-management.page";
import OnboardingPage from "./(app)/onboarding/onboarding.page";
import ProfilePage from "./(app)/profile/profile.page";
import PropertyDetailsPage from "./(app)/property-details/property-details.page";
import TradingPage from "./(app)/trading/trading.page";
import HomePage from "./(landing)/home.page";

export const pages = {
  dashboardPage: <DashboardPage />,
  profilePage: <ProfilePage />,
  listPropertyPage: <ListPropertyPage />,
  newListingsPage: <NewListingsPage />,
  buyOrRentPage: <BuyOrRentPage />,
  tradingPage: <TradingPage />,
    propertyDetailsPage: <PropertyDetailsPage />,
  approveBidPage: <BidPage />,

  onboardingPage: <OnboardingPage />,
  // onboardings
  propertyManagementPage: <PropertyManagementPage />,
  getVerifiedPage: <GetVerifiedPage />,
  // landing page
  homePage: <HomePage />,
};
