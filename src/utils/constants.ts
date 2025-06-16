import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { RiListCheck2 } from "react-icons/ri";
import { IoImagesOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { assets } from "@/assets";

import { RiBuilding2Line, RiHomeOfficeFill } from "react-icons/ri";
import { MdFactory } from "react-icons/md";
import { PiIslandDuotone, PiTreeFill, PiWarehouseFill } from "react-icons/pi";

export const variants = {
  fadeIn: (direction: "up" | "down" | "left" | "right", delay: number) => {
    return {
      hidden: {
        y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
        x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
        opacity: 0,
      },
      show: {
        y: 0,
        x: 0,
        opacity: 1,
        transition: {
          type: "tween",
          duration: 0.8,
          delay: delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        },
      },
    };
  },
};

export const listPropertyOptions = [
  {
    type: "building" as const,
    title: "Developed Property",
    description:
      "Includes completed structures for living, business, or industry",
    icon: RiBuilding2Line,
    subTypes: [
      { icon: RiHomeOfficeFill, label: "Residential" },
      { icon: MdFactory, label: "Commercial" },
      { icon: PiWarehouseFill, label: "Industrial" },
    ],
  },
  {
    type: "land" as const,
    title: "Undeveloped Land",
    description:
      "Raw or unused land suitable for farming, housing, or commerce",
    icon: PiIslandDuotone,
    subTypes: [
      { icon: PiTreeFill, label: "Agricultural" },
      { icon: RiHomeOfficeFill, label: "Residential" },
      { icon: PiWarehouseFill, label: "Commercial" },
    ],
  },
];

export const connectorsInfo = [
  {
    id: "argentX",
    name: "Argent X",
    installLink:
      "https://chromewebstore.google.com/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb",
  },
];

export const listingTypes = ["Rent", "Sale"] as const;

export const propertyTypes = [
  {
    value: "residential",
    label: "Residential Property",
  },
  {
    value: "commercial",
    label: "Commercial Property",
  },
  {
    value: "industrial",
    label: "Industrial Property",
  },
  {
    value: "land",
    label: "Land",
  },
  {
    value: "mixed-use",
    label: "Mixed-use Property",
  },
] as const;

export const createListingSteps = [
  {
    title: "Property Basics",
    subtitle: "Enter your property's address, type, and price.",
    icon: MdOutlineFeaturedPlayList,
    fields: [
      "propertyType",
      "listingType",
      "title",
      "country",
      "location",
      "price",
      "description",
    ],
  },
  {
    title: "Property Features",
    subtitle: "Add amenities, utilities, and other features.",
    icon: RiListCheck2,
    fields: [
      "bedrooms",
      "bathrooms",
      "sizeSqft",
      "landArea",
      "parkingSpaces",
      "yearBuilt",
      "amenities",
    ],
  },
  {
    title: "Property Media",
    subtitle: "Upload photos and/or videos of your property.",
    icon: IoImagesOutline,
    fields: ["banner", "photos"],
  },
  {
    title: "Legal Documents",
    subtitle: "Submit a valid document for DAO approval.",
    icon: HiOutlineDocumentText,
    fields: ["propertyDocuments"],
  },
];

export const nav_routes = [
  { label: "About", path: "/about" },
  { label: "Token", path: "/token", comingSoon: true },
  { label: "Listings", path: "/properties" },
  { label: "Blog", path: "/blog" },
];

export const footer_routes = [
  {
    label: "About",
    path: ["partners", "careers", "press", "community"],
  },
  {
    label: "Listings",
    path: ["features", "how it works", "pricing"],
  },
  {
    label: "Community",
    path: ["events", "blog", "forum", "podcast", "telegram"],
  },
];

export const feedbacks = [
  {
    id: 1,
    feedback:
      "Coiton made it possible for me to invest in real estate without needing a huge capital. The process was seamless and secure!",
    name: "John Stevens",
    position: "CEO, Even Steven",
    image: assets.svgs.johnProfile,
  },
  {
    id: 2,
    feedback:
      "Finally, a platform that brings real estate investment into the digital age. Coiton is the future!",
    name: "Yusuf Benson",
    position: "CTO, Benson's Properties",
    image: assets.svgs.yusufProfile,
  },
  {
    id: 3,
    feedback:
      "Coiton's platform is user-friendly and efficient. I appreciate how easy it is to diversify my investment portfolio with real estate tokens.",
    name: "Ikenna Akpabio",
    position: "CEO, IK Investments",
    image: assets.svgs.ikenneProfile,
  },
  {
    id: 4,
    feedback:
      "As a property developer, Coiton has opened up new opportunities for me to connect with investors and fund my projects faster. It's a win-win!",
    name: "Frank Emmanuel",
    position: "Property Developer",
    image: assets.svgs.frankProfile,
  },
];
