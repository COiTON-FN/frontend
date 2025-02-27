import BuyOrRentPage from "./(app)/buy-or-rent/buy-or-rent.page";
import DashboardPage from "./(app)/dashboard/dashboard.page";
// import GovernancePage from "./(app)/governance/governance.page";
import NewListingPage from "./(app)/new-listing/new-listing.page";
import GetVerifiedPage from "./(app)/onboarding/account-type/get-verified.page";
import PropertyManagementPage from "./(app)/onboarding/account-type/property-management.page";
import OnboardingPage from "./(app)/onboarding/onboarding.page";
import ProfilePage from "./(app)/profile/profile.page";
import PropertyDetailsPage from "./(app)/property-details/property-details.page";
// import NewProposalPage from "./(app)/proposal/new-proposal.page";
// import ProposalsPage from "./(app)/proposal/proposals.page";
import TradingPage from "./(app)/trading/trading.page";
import HomePage from "./(landing)/home.page";

export const pages = {
  dashboardPage: <DashboardPage />,
  profilePage: <ProfilePage />,
  listPropertyPage: <NewListingPage />,
  buyOrRentPage: <BuyOrRentPage />,
  // governancePage: <GovernancePage />,
  // proposalsPage: <ProposalsPage />,
  // newProposalPage: <NewProposalPage />,
  tradingPage: <TradingPage />,
  propertyDetailsPage: <PropertyDetailsPage />,

  onboardingPage: <OnboardingPage />,
  // // onboardings
  propertyManagementPage: <PropertyManagementPage />,
  getVerifiedPage: <GetVerifiedPage />,
  // landing page
  homePage: <HomePage />,
};
