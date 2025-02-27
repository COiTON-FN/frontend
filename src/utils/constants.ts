import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { RiListCheck2 } from "react-icons/ri";
import { IoImagesOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { assets } from "@/assets";

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
  { label: "Listings", path: "/listings" },
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

export const dummy_properties = [
  {
    id: 1,
    isApproved: true,
    title: "Sunny Villa",
    propertyType: "House",
    address: "123 Sunshine St, Miami, FL",
    createdAt: "June 14, 2023",
    price: 500000,
    image: [
      "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
  },
  {
    id: 2,
    isApproved: true,
    title: "Cozy Cottage",
    propertyType: "Cottage",
    address: "456 Oak Lane, Asheville, NC",
    createdAt: "June 14, 2023",
    price: 300000,
    image: [
      "https://images.pexels.com/photos/979190/pexels-photo-979190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
  },
  {
    id: 3,
    isApproved: true,
    title: "Urban Apartment",
    propertyType: "Apartment",
    address: "789 Main St, New York, NY",
    createdAt: "June 14, 2023",
    price: 750000,
    image: [
      "https://images.pexels.com/photos/4280017/pexels-photo-4280017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
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
