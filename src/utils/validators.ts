import { z } from "zod";

export const buildingFormSchema = z.object({
  // 1. Property Basics
  title: z.string().min(3, "Title must be at least 3 characters"),
  images: z
    .array(z.custom<File>())
    .min(1, "Please select at least one image")
    .max(10, "You can upload a maximum of 10 images")
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
      message: "Each image must be less than 5MB",
      path: ["files"],
    }),
  imagesCid: z.array(z.string()).optional(),
  videos: z
    .array(z.custom<File>())
    .max(1, "You can upload a maximum of 1 videos")
    .optional(),
  videosCid: z.array(z.string()).optional(),
  description: z.string().min(5, "Description must be at least 5 characters"),
  propertyType: z.string({ required_error: "Please select a property type" }),

  // 2. Address
  region: z
    .tuple(
      [
        // Country
        z.string().min(2, "Country is required"),
        // State
        z.string().min(2, "State is required"),
      ],
      {
        required_error: "Please select a country",
      },
    )
    .refine(([country]) => !!country, {
      message: "Please select a country",
    }),
  zip: z
    .string({ invalid_type_error: "ZIP code must be a number" })
    .min(1, "ZIP code is required"),
  landmark: z.string({ required_error: "Landmark is required" }).optional(),
  area: z
    .string({ required_error: "Area is required" })
    .min(2, "Area is required"),
  map: z.object(
    {
      lat: z.coerce.number({ invalid_type_error: "Latitude must be a number" }),
      lng: z.coerce.number({
        invalid_type_error: "Longitude must be a number",
      }),
      name: z.string().min(1, "Map name is required"),
    },
    { required_error: "Please select a location" },
  ),

  // 3. Details
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(1, "Price is required"),
  rooms: z.coerce
    .number({ invalid_type_error: "Rooms must be a number" })
    .min(1, "Number of rooms is required"),
  bathrooms: z.coerce
    .number({ invalid_type_error: "Bathrooms must be a number" })
    .min(1, "Number of bathrooms is required"),
  bedrooms: z.coerce
    .number({ invalid_type_error: "Bedrooms must be a number" })
    .min(1, "Number of bedrooms is required"),
  yearBuilt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Year built must be a valid date",
  }),
  structureType: z.string({
    required_error: "Please select a structure type",
  }),
  propertySize: z.coerce
    .number({ invalid_type_error: "Property size must be a number" })
    .min(1, "Property size is required"),

  // 4. Amenities and Features
  interior: z
    .array(z.string())
    .nonempty("Please select at least one interior feature"),
  exterior: z
    .array(z.string())
    .nonempty("Please select at least one exterior feature"),
  utilities: z
    .array(z.string())
    .nonempty("Please select at least one utility")
    .optional(),

  // 5. Floor Plan
  floorPlan: z
    .array(z.custom<File>(), { required_error: "Floor plan is required" })
    .min(1, "Please select at least one floor plan file")
    .max(10, "You can upload a maximum of 10 floor plan files")
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
      message: "Each floor plan file must be less than 5MB",
      path: ["files"],
    }),
  floorPlanCid: z.array(z.string()).optional(),
  license: z
    .array(z.custom<File>(), { required_error: "License is required" })
    .max(1, "You can upload only 1 license file")
    .max(3, "You can upload at least 3 license file"),
  licenseCid: z.array(z.string()).optional(),
});

export type BuildingFormSchemaProps = z.infer<typeof buildingFormSchema>;

export const landFormSchema = z.object({
  // 1. Property Basics
  title: z.string().min(3, "Title must be at least 3 characters"),
  images: z
    .array(z.custom<File>())
    .min(1, "Please select at least one image")
    .max(10, "You can upload a maximum of 10 images")
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
      message: "Each image must be less than 5MB",
      path: ["files"],
    }),
  imagesCid: z.array(z.string()).optional(),
  videos: z
    .array(z.custom<File>())
    .max(1, "You can upload a maximum of 1 videos")
    .optional(),
  videosCid: z.array(z.string()).optional(),
  description: z.string().min(5, "Description must be at least 5 characters"),
  propertyType: z.string({ required_error: "Please select a property type" }),

  // 2. Address
  region: z
    .tuple(
      [
        // Country
        z.string().min(2, "Country is required"),
        // State
        z.string().min(2, "State is required"),
      ],
      {
        required_error: "Please select a country",
      },
    )
    .refine(([country]) => !!country, {
      message: "Please select a country",
    }),
  zip: z
    .string({ invalid_type_error: "ZIP code must be a number" })
    .min(1, "ZIP code is required"),
  landmark: z.string({ required_error: "Landmark is required" }).optional(),
  area: z
    .string({ required_error: "Area is required" })
    .min(2, "Area is required"),
  map: z.object(
    {
      lat: z.coerce.number({ invalid_type_error: "Latitude must be a number" }),
      lng: z.coerce.number({
        invalid_type_error: "Longitude must be a number",
      }),
      name: z.string().min(1, "Map name is required"),
    },
    { required_error: "Please select a location" },
  ),

  landSize: z.coerce
    .number({ invalid_type_error: "Land size must be a number" })
    .min(1, "Land size is required"),
  surveyDescription: z
    .string()
    .min(5, "Description must be at least 5 characters"),
  surveyPlan: z
    .array(z.custom<File>())
    .min(1, "Please select at least one image")
    .max(3, "You can upload a maximum of 3 images")
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
      message: "Each image must be less than 5MB",
      path: ["files"],
    }),
  surveyPlanCid: z.array(z.string()).optional(),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(1, "Price is required"),
});

export type LandFormSchemaProps = z.infer<typeof landFormSchema>;

// ? ONBOARDING SCHEMA
export const onboardingSchema = z.object({
  pass: z.boolean().default(true),
  address: z.coerce.string(),
});

export type ONBOARDING_SCHEMA = z.infer<typeof onboardingSchema>;
