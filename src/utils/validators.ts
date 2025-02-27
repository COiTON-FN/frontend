import { z } from "zod";
import { listingTypes, propertyTypes } from "./constants";
import { countryOptions } from "@/lib/utils";

// ? CREATE LISTING FORM SCHEMA
const propertyTypeValues = propertyTypes.map((type) => type.value);
const countriesValue = countryOptions.map((type) => type.name);

export const createListingSchema = z.object({
  owner: z.string(),
  // 1. Property Basics
  propertyType: z.enum(propertyTypeValues as [string, ...string[]], {
    required_error: "Property type is required",
    message: "Property type is required",
  }),
  listingType: z.enum(listingTypes, {
    required_error: "Listing type is required",
  }),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must not exceed 30 characters"),
  country: z.enum(countriesValue as [string, ...string[]], {
    required_error: "Country is required",
  }),
  location: z
    .object({
      id: z.coerce.number(),
      name: z.coerce.string({ required_error: "Location is required" }),
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
    })
    .optional(),
  price: z.coerce
    .number({
      required_error: "Price is required",
    })
    .min(1, {
      message: "Price must be at least $1",
    }),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(1000, "Description must not exceed 1000 characters"),

  // 2. Property Features
  bedrooms: z.coerce.number().min(1, {
    message: "Must be at least 1",
  }),
  bathrooms: z.coerce.number().min(1, {
    message: "Must be at least 1",
  }),
  sizeSqft: z.coerce.number().optional(),
  landArea: z.coerce.number().optional(),
  parkingSpaces: z.coerce.number().optional(),
  yearBuilt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  amenities: z.array(z.string()).optional(),

  // 3. Property Media
  banner: z
    .array(z.instanceof(File), {
      message: "Banner are required",
    })
    .min(1, {
      message: "Banner is required",
    })
    .max(1, {
      message: "Maximum 1 file are allowed",
    }),
  bannerCid: z.string().optional(),
  media: z
    .array(z.instanceof(File), {
      message: "Property images are required",
    })
    .min(1, {
      message: "Property images are required",
    })
    .max(10, {
      message: "Maximum 10 files are allowed",
    }),
  mediaCid: z.array(z.string()).optional(),

  // 4. Legal Documents
  documents: z
    .array(z.instanceof(File), {
      message: "Legal document is required",
    })
    .min(1, {
      message: "Minimum of 1 document is required",
    })
    .max(5, {
      message: "Maximum of 5 documents are allowed",
    }),
  documentCid: z.array(z.string()).optional(),
});

export type CREATE_LISTING_SCHEMA = z.infer<typeof createListingSchema>;

// ? CREATE PROPOSAL FORM SCHEMA
export const createProposalSchema = z.object({
  title: z.coerce
    .string({
      required_error: "Title is required.",
    })
    .min(2, {
      message: "Title must be at least 2 characters.",
    }),
  description: z.coerce
    .string({
      required_error: "Description title is required.",
    })
    .min(2, {
      message: "Description must be at least 2 characters.",
    }),
  discussion: z.coerce
    .string({
      required_error: "Discussion title is required.",
    })
    .min(2, {
      message: "Discussion must be at least 2 characters.",
    }),
});

export type CREATE_PROPOSAL_SCHEMA = z.infer<typeof createProposalSchema>;

// ? ONBOARDING SCHEMA
export const onboardingSchema = z.object({
  pass: z.boolean().default(true),
  address: z.coerce.string(),
});

export type ONBOARDING_SCHEMA = z.infer<typeof onboardingSchema>;

export const registrationSchema = z.object({
  isDao: z.coerce.boolean().default(false),
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must not exceed 30 characters"),
  email: z.coerce
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" })
    .min(3, "Email must be at least 3 characters"),
  phone: z.object({
    national: z.coerce
      .string({ required_error: "Phone number is required" })
      .min(1, { message: "Phone number is required" }),
    international: z.coerce.string().optional(),
  }),
  region: z.object({
    country: z
      .object({
        countryName: z.coerce
          .string({ required_error: "Country is required" })
          .min(1, {
            message: "Country is required",
          }),
        countryCode: z.coerce
          .string({ required_error: "Country is required" })
          .min(1, {
            message: "Country is required",
          }),
        countryFlag: z.coerce.string().optional(),
        countryLat: z.coerce
          .number({ required_error: "Country is required" })
          .min(1, {
            message: "Country is required",
          }),
        countryLong: z.coerce
          .number({ required_error: "Country is required" })
          .min(1, {
            message: "Country is required",
          }),
      })
      .refine((data) => data.countryCode !== "", {
        message: "Country is required",
        path: ["countryCode"],
      }),
    state: z
      .object({
        stateName: z.coerce
          .string({ required_error: "State is required" })
          .optional(),
        stateCode: z.coerce
          .string({ required_error: "State is required" })
          .optional(),
        countryCode: z.coerce
          .string({ required_error: "State is required" })
          .optional(),
        stateLat: z.coerce
          .number({ required_error: "State is required" })
          .optional(),
        stateLong: z.coerce
          .number({ required_error: "State is required" })
          .optional(),
      })
      .optional(),
    // city: z
    //   .object({
    //     cityName: z.coerce
    //       .string({ required_error: "City is required" })
    //       .min(1, {
    //         message: "City is required",
    //       }),
    //     stateCode: z.coerce
    //       .string({ required_error: "City is required" })
    //       .min(1, {
    //         message: "City is required",
    //       }),
    //     countryCode: z.coerce
    //       .string({ required_error: "City is required" })
    //       .min(1, {
    //         message: "City is required",
    //       }),
    //     cityLat: z.coerce
    //       .number({ required_error: "City is required" })
    //       .min(1, {
    //         message: "City is required",
    //       }),
    //     cityLong: z.coerce
    //       .number({ required_error: "City is required" })
    //       .min(1, {
    //         message: "City is required",
    //       }),
    //   })
    //   .refine((data) => data.cityName !== "", {
    //     message: "City is required",
    //     path: ["cityName"],
    //   }),
  }),
  socials: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().url("Please enter a valid URL"),
        type: z.enum([
          "twitter",
          "instagram",
          "telegram",
          "facebook",
          "linkedin",
          "other",
        ]),
      }),
      {
        required_error: "Please add at least one social media",
      },
    )
    .min(1, "At least one social media is required")
    .max(6, {
      message: "You can only add up to 6 social media",
    }),
});

export type PROPERTY_MANAGEMENT_SCHEMA = z.infer<typeof registrationSchema>;
