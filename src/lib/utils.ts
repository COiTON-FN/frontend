import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import countries from "world-countries";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { variables } from "@/utils/variables";
import { SOCIAL_TYPES } from "@/pages/(app)/onboarding/_components/social-input";
import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";

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

export function truncateAddr(str: string | undefined, n: number = 6): string {
  if (!str) return "";
  return str?.length > n
    ? str.slice(0, n) + "..." + str.slice(str.length - 4)
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

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
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
  const avatar = createAvatar(pixelArt, {
    seed: `address-${address?.toLowerCase()}`,
  });

  const svg = avatar.toDataUri();

  return svg;
}
