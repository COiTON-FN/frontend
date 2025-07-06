import ListingsPage from "./(app)/properties/properties.page";
import DashboardPage from "./(app)/dashboard/dashboard.page";
import ListPropertyPage from "./(app)/list-property/list-property.page";
import OnboardingPage from "./(onboarding)/onboarding.page";
import ProfilePage from "./(app)/profile/profile.page";
import PropertyDetailsPage from "./(app)/property-details/property-details.page";
import TradingPage from "./(app)/trading/trading.page";
import HomePage from "./(landing)/home.page";
import UsersPage from "./(app)/users/users.page";
import IndividualForm from "./(onboarding)/account-type/individual.form";
import EntityForm from "./(onboarding)/account-type/entity.form";
import AboutPage from "./(app)/about/about.page";

export const pages = {
  dashboardPage: <DashboardPage />,
  profilePage: <ProfilePage />,
  listPropertyPage: <ListPropertyPage />,
  listingsPage: <ListingsPage />,
  tradingPage: <TradingPage />,
  propertyDetailsPage: <PropertyDetailsPage />,
  usersPage: <UsersPage />,
  aboutPage: <AboutPage />,

  onboardingPage: <OnboardingPage />,
  // onboardings
  individualForm: <IndividualForm />,
  entityForm: <EntityForm />,
  // landing page
  homePage: <HomePage />,
};
