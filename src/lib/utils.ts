import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import countries from "world-countries";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { variables } from "@/utils/variables";
import { SOCIAL_TYPES } from "@/components/extension/social-input";
import { createAvatar } from "@dicebear/core";
import { dylan } from "@dicebear/collection";
import { byteArrayToString, toHex } from "./starknet/utils";
import { User } from "@/store/slice/credential.slice";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array]; // Create a copy to avoid mutating the original array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

export const extractDecodedErrorReasons = (errorMsg: string) => {
  const hexMatches = errorMsg.match(/0x[0-9a-fA-F]{8,}/g);
  if (!hexMatches) return "Execution error";

  const decodeHex = (hex: any) => {
    hex = hex.replace(/^0x/, "");
    let decoded = "";
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.slice(i, i + 2), 16);
      decoded +=
        charCode >= 32 && charCode <= 126 ? String.fromCharCode(charCode) : ""; // skip unreadable characters
    }
    return decoded;
  };

  const priorityOrder = [
    "INVALID_LISTING",
    "UNAUTHORIZED",
    "ALREADY_EXIST",
    "INVALID_PARAM",
    "PRICE_TOO_LOW",
    "INSUFFICIENT_ALLOWANCE",
    "INSUFFICIENT_BALANCE",
    "NOT_REGISTERED",
    "INVALID_ADDRESS",
    "NOT_FOR_SALE",
  ];

  const decoded = hexMatches
    .map(decodeHex)
    .filter((str) => str && /^[A-Z0-9_\/-]{5,}$/.test(str)); // keep error-like strings

  const errs = decoded.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a);
    const bIndex = priorityOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  if (errs.length) {
    return errs[0];
  }

  const match = errorMsg.match(/'([^']+)'/);
  return (match ?? ["Execution error"])[0];
};

export function truncateAddr(str: string | undefined, n: number = 4): string {
  if (!str) return "";
  return str?.length > n
    ? str.slice(0, 6) + "..." + str.slice(str.length - n)
    : str;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`;
}

export async function copyToClipboard(
  text: string,
  msg = "Copied to clipboard",
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(msg);
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to copy text to clipboard",
    );
  }
}

// Function to structure data: country -> states -> cities
export const getCountries = () => {
  return Country.getAllCountries().map((country) => ({
    countryName: country.name,
    countryCode: country.isoCode,
    countryFlag: country.flag,
    countryLat: Number(country.latitude),
    countryLong: Number(country.longitude),
  }));
};

export interface CountryData {
  countryName: string;
  countryCode: string;
  countryFlag: string;
  countryLat: number;
  countryLong: number;
}

export const getStatesByCountry = (countryCode: string) => {
  return State.getStatesOfCountry(countryCode).map((state) => ({
    stateName: state.name,
    stateCode: state.isoCode,
    countryCode: state.countryCode,
    stateLat: Number(state.latitude),
    stateLong: Number(state.longitude),
  }));
};

export interface StateData {
  stateName: string;
  stateCode: string;
  countryCode: string;
  stateLat: number;
  stateLong: number;
}

export const getCitiesByState = (countryCode: string, stateCode: string) => {
  return City.getCitiesOfState(countryCode, stateCode).map((city) => ({
    cityName: city.name,
    stateCode: city.stateCode,
    countryCode: city.countryCode,
    cityLat: Number(city.latitude),
    cityLong: Number(city.longitude),
  }));
};

export interface CityData {
  cityName: string;
  stateCode: string;
  countryCode: string;
  cityLat: number;
  cityLong: number;
}

export const countryOptions = countries.map((country) => ({
  code: country.cca2,
  name: country.name.common,
  flag: country.flag,
  latitude: country.latlng[0],
  longitude: country.latlng[1],
}));

export function getCountryByCode(code: string) {
  return countryOptions.find((country) => country.code === code);
}

export const apiClient = axios.create({
  baseURL: variables.renderEndpoint,
  headers: {
    "Content-Type": "application/json",
  },
});

export const makePayment = async (paymentData: {
  receipt: number;
  address: string;
}) => {
  try {
    const response = await axios.post(
      `${variables.renderEndpoint}/api/v1/payment`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Payment API error:", error);
    throw error;
  }
};

export const lcStorage = {
  save: <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  load: <T>(key: string): T | null => {
    const storedData = localStorage.getItem(key);
    return storedData ? (JSON.parse(storedData) as T) : null;
  },
  clear: (key: string) => {
    localStorage.removeItem(key);
  },
};

export function detectSocialType(url: string): SOCIAL_TYPES {
  const lowercaseUrl = url.toLowerCase();
  if (lowercaseUrl.includes("twitter.com") || lowercaseUrl.includes("x.com"))
    return "twitter";
  if (lowercaseUrl.includes("instagram.com")) return "instagram";
  if (lowercaseUrl.includes("t.me") || lowercaseUrl.includes("telegram"))
    return "telegram";
  if (
    lowercaseUrl.includes("linkedin.com/in") ||
    lowercaseUrl.includes("linkedin")
  )
    return "linkedin";
  if (
    lowercaseUrl.includes("facebook.com") ||
    lowercaseUrl.includes("facebook")
  )
    return "facebook";
  return "other";
}

export function getSocialIcon(type: SOCIAL_TYPES) {
  switch (type) {
    case "twitter":
      return "twitter";
    case "instagram":
      return "instagram";
    case "telegram":
      return "telegram";
    case "linkedin":
      return "linkedin";
    default:
      return "link";
  }
}

export function generateAvatarFromAddress(address: string) {
  if (!address)
    return "https://api.dicebear.com/9.x/dylan/svg?seed=coiton&backgroundColor=29e051,b6e3f4,619eff,ffdfbf,ffd5dc,ffa6e6,d1d4f9,c0aede&randomizeIds=true&mood=angry,confused,happy,hopeful,neutral,superHappy,sad";
  const avatar = createAvatar(dylan, {
    seed: `address-${address?.toLowerCase()}`,
    mood: ["happy", "hopeful", "superHappy"],
    randomizeIds: true,
  });

  const svg = avatar.toDataUri();

  return svg;
}

export const formatUser = (user: any): User => ({
  ...user,
  address: toHex(user.address),
  id: Number(user.id),
  details: byteArrayToString(user.details),
  user_type:
    Number(user.user_type) === 0
      ? "Individual"
      : Number(user.user_type) === 1
        ? "Entity"
        : "Unknown",
});
