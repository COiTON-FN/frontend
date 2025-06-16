import BidPage from "./(app)/bid/bid.page";
import ListingsPage from "./(app)/properties/properties.page";
import DashboardPage from "./(app)/dashboard/dashboard.page";
import ListPropertyPage from "./(app)/list-property/list-property.page";
import RequestsPage from "./(app)/requests/requests.page";
import OnboardingPage from "./(onboarding)/onboarding.page";
import ProfilePage from "./(app)/profile/profile.page";
import PropertyDetailsPage from "./(app)/property-details/property-details.page";
import TradingPage from "./(app)/trading/trading.page";
import HomePage from "./(landing)/home.page";
import UsersPage from "./(app)/users/users.page";
import IndividualForm from "./(onboarding)/account-type/individual.form";
import EntityForm from "./(onboarding)/account-type/entity.form";

export const pages = {
  dashboardPage: <DashboardPage />,
  profilePage: <ProfilePage />,
  listPropertyPage: <ListPropertyPage />,
  requestsPage: <RequestsPage />,
  listingsPage: <ListingsPage />,
  tradingPage: <TradingPage />,
  propertyDetailsPage: <PropertyDetailsPage />,
  approveBidPage: <BidPage />,
  usersPage: <UsersPage />,

  onboardingPage: <OnboardingPage />,
  // onboardings
  individualForm: <IndividualForm />,
  entityForm: <EntityForm />,
  // landing page
  homePage: <HomePage />,
};
