export const siteConfig = {
  sitemap: {
    default: {
      title: "Coiton",
      description:
        "Bringing Nigeria's $2.4 Trillion Real Estate Market On-Chain with Blockchain Technology",
    },
    dashboard: {
      title: "Dashboard",
    },
    properties: {
      title: "Properties",
    },
    trade: {
      title: "Trading",
    },
    about: {
      title: "About Us",
    },
    listProperty: {
      title: "Add Property",
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
  },
  handle: "@COiTON",
};
