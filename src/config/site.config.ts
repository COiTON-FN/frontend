export const siteConfig = {
  sitemap: {
    default: {
      title: "Coiton",
      description:
        "Bringing $2.4 Trillion Real Estate Market On-Chain with Blockchain Technology Globally.",
    },
    dashboard: {
      title: "Dashboard",
      description:
        "View your portfolio, monitor assets, and manage your on-chain real estate activity in one place",
    },
    properties: {
      title: "Properties",
      description:
        "Browse verified, tokenized real estate listings available for fractional or full investment",
    },
    trade: {
      title: "Trading",
      description:
        "Invest in property tokens, track asset performance, and trade real estate shares seamlessly on-chain",
    },
    about: {
      title: "About Us",
      description:
        "Learn about Coiton's mission to democratize real estate access through blockchain technology",
    },
    listProperty: {
      title: "Add Property",
      description:
        "Tokenize your property, verify ownership, and list it on the Coiton marketplace for investor access",
    },
  },
  image: "/og-image.png",
  icons: {
    icon: [
      { url: "/logo/coiton.svg", sizes: "16x16" },
      { url: "/logo/coiton.svg", sizes: "32x32" },
      { url: "/logo/coiton.svg", sizes: "64x64" },
      { url: "/logo/coiton.svg", sizes: "128x128" },
      { url: "/logo/coiton.svg", sizes: "180x180" },
    ],
    shortcut: "/logo/coiton.svg",
  },
  url: import.meta.env.VITE_BASE_URL,
  social: {
    twitter: "https://x.com/COiTON",
    instagram: "https://www.instagram.com/_coiton",
    linkedin: "https://www.linkedin.com/in/coiton-nigeria-b59b6831a/",
    facebook: "",
    youtube: "",
    telegram: "https://t.me/COiTONRealEstates",
  },
  handle: "@COiTON",
};
