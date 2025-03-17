import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Indicator from "@/pages/(app)/list-property/_components/indicator";
import { Form } from "@/components/ui/form";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListingSchema } from "@/utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useState } from "react";
import {
  MdOutlineFeaturedPlayList,
  MdOutlineMapsHomeWork,
} from "react-icons/md";
import {
  HiOutlineBuildingLibrary,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { ArrowLeft } from "lucide-react";
import { RiListCheck2 } from "react-icons/ri";
import { IoImagesOutline } from "react-icons/io5";
import { z } from "zod";
import LandForm from "./steps/land-form";
import BuildingForm from "./steps/building-form";
import PropertyTypeForm from "./steps/property-type-form";
import { resetForm } from "@/store/slice/new-listing.slice";

const propertyTypeSteps = [
  {
    title: "What are you listing?",
    subtitle: "Building or Land",
    icon: MdOutlineMapsHomeWork,
    fields: ["building", "land"],
  },
];

const buildingSteps = [
  {
    title: "Property Basics",
    subtitle: "Please provide your name and email",
    icon: MdOutlineFeaturedPlayList,
  },
  {
    title: "Address",
    subtitle: "Please provide property details",
    icon: RiListCheck2,
    fields: [
      "region.country",
      "region.state",
      "region.city",
      "zip",
      "landmark",
      "area",
    ],
  },
  {
    title: "Details",
    subtitle: "Upload pictures of your property",
    icon: IoImagesOutline,
  },
  {
    title: "Amenities and Features",
    subtitle: "Upload pictures of your property",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Floor Plans",
    subtitle: "Upload pictures of your property",
    icon: HiOutlineDocumentText,
  },
];

const landSteps = [
  {
    title: "Address",
    subtitle: "Please provide your name and email",
    icon: RiListCheck2,
  },
  {
    title: "Survey Plan: (Property license)",
    subtitle: "Please provide property details",
    icon: MdOutlineFeaturedPlayList,
  },
  {
    title: "Property Basics",
    subtitle: "Please provide your name and email",
    icon: MdOutlineFeaturedPlayList,
  },
];

export const buildingFormSchema = z.object({
  // 1. Property Basics
  title: z.string().min(3),
  images: z.array(z.instanceof(File)).min(1).max(10),
  imagesCid: z.array(z.string()).optional(),
  videos: z.array(z.instanceof(File)).max(3).optional(),
  videosCid: z.array(z.string()).optional(),
  description: z.string().min(5),
  propertyType: z.string().default("building"),

  // 2. Address
  region: z.object({
    country: z
      .object({
        countryName: z.string().min(1),
        countryCode: z.string().min(1),
        countryFlag: z.string().optional(),
        countryLat: z.coerce.number().min(1),
        countryLong: z.coerce.number().min(1),
      })
      .refine((data) => data.countryCode !== "", {
        message: "Country is required",
        path: ["countryCode"],
      }),
    state: z
      .object({
        stateName: z.string().optional(),
        stateCode: z.string().optional(),
        countryCode: z.string().optional(),
        stateLat: z.coerce.number().optional(),
        stateLong: z.coerce.number().optional(),
      })
      .optional(),
    city: z
      .object({
        cityName: z.string().optional(),
        stateCode: z.string().optional(),
        countryCode: z.string().optional(),
        cityLat: z.coerce.number().optional(),
        cityLong: z.coerce.number().optional(),
      })
      .optional(),
  }),
  zip: z.coerce.number().min(1),
  landmark: z.string(),
  area: z.string(),
  map: z.string(),

  // 3. Details
  // rangeFrom: z.coerce.number().min(1),
  // rangeTo: z.coerce.number().min(1),
  price: z.coerce.number().min(1),
  rooms: z.coerce.number().min(1),
  bathrooms: z.coerce.number().min(1),
  bedrooms: z.coerce.number().min(1),
  yearBuilt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  structureType: z.string(),
  propertySize: z.coerce.number().min(1),

  // 4. Amenities and Features
  interior: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(1),
  exterior: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(1),
  utilities: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .min(1),
  others: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    )
    .optional(),

  // 5. Floor Plan
  floorPlan: z.array(z.instanceof(File)).min(1).max(10),
  floorPlanCid: z.array(z.string()).optional(),
  license: z.array(z.instanceof(File)).min(1).max(3),
  licenseCid: z.array(z.string()).optional(),
});

export const landFormSchema = z.object({
  // 1. Address
  region: z.object({
    country: z
      .object({
        countryName: z.string().min(1),
        countryCode: z.string().min(1),
        countryFlag: z.string().optional(),
        countryLat: z.coerce.number().min(1),
        countryLong: z.coerce.number().min(1),
      })
      .refine((data) => data.countryCode !== "", {
        message: "Country is required",
        path: ["countryCode"],
      }),
    state: z
      .object({
        stateName: z.string().optional(),
        stateCode: z.string().optional(),
        countryCode: z.string().optional(),
        stateLat: z.coerce.number().optional(),
        stateLong: z.coerce.number().optional(),
      })
      .optional(),
    city: z
      .object({
        cityName: z.string().optional(),
        stateCode: z.string().optional(),
        countryCode: z.string().optional(),
        cityLat: z.coerce.number().optional(),
        cityLong: z.coerce.number().optional(),
      })
      .optional(),
  }),
  zip: z.coerce.number().min(1),
  landmark: z.string(),
  area: z.string(),
  map: z.string(),

  // 2. Survey Plan: (Property license)
  landSize: z.coerce.number().min(1),
  // boundariesFrom: z.string().min(2),
  // boundariesTo: z.string().min(2),
  surveyDescription: z.string().min(5).max(1000),
  surveyPlan: z.array(z.instanceof(File)).min(1).max(3),
  surveyPlanCid: z.array(z.string()).optional(),
  price: z.coerce.number().min(1),
  // yearBuilt: z.string().refine((date) => !isNaN(Date.parse(date)), {
  //   message: "Invalid date format",
  // }),
  // plotSize: z.coerce.number().min(1),

  // 3. Property Basics
  title: z.string().min(3),
  images: z.array(z.instanceof(File)).min(1).max(10),
  imagesCid: z.array(z.string()).optional(),
  videos: z.array(z.instanceof(File)).max(3).optional(),
  videosCid: z.array(z.string()).optional(),
  description: z.string().min(5),
  propertyType: z.string().default("land"),
});

export type BuildingFormSchemaTypes = z.infer<typeof buildingFormSchema>;
export type LandFormSchemaTypes = z.infer<typeof landFormSchema>;

export default function ListPropertyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const newListingState = useSelector((state: RootState) => state.newListing);
  const [selectedType, setSelectedType] = useState<"building" | "land" | null>(
    null,
  );

  const form = useForm<BuildingFormSchemaTypes | LandFormSchemaTypes>({
    resolver: zodResolver(
      selectedType === "building" ? buildingFormSchema : createListingSchema,
    ),
  });

  const steps =
    selectedType === "building"
      ? buildingSteps
      : selectedType === "land"
        ? landSteps
        : propertyTypeSteps;

  // Safely access the current step
  const currentStepIndex = Math.max(
    0,
    Math.min(steps.length - 1, newListingState.currentStep - 1),
  );

  // Safely destructure the current step or provide fallback values
  const {
    icon: Icon,
    title,
    subtitle,
  } = steps[currentStepIndex] ?? {
    icon: HiOutlineBuildingLibrary,
    title: "Title",
    subtitle: "Subtitle",
  };

  return (
    <div className="relative flex flex-col gap-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Listing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="relative flex w-full flex-col">
        <div className="flex gap-4 sm:gap-6">
          <div className="mx-auto hidden py-10 lg:flex xl:px-5 2xl:px-10">
            <div className="flex h-full flex-1 flex-col gap-10 py-5 2xl:px-10">
              <p
                onClick={() => {
                  setSelectedType(null);
                  dispatch(resetForm());
                }}
                className="flex cursor-pointer items-center whitespace-nowrap text-[32px] font-bold leading-none text-primary"
              >
                {selectedType !== null && <ArrowLeft className="mr-4 size-7" />}{" "}
                <span>
                  {selectedType === "building"
                    ? "Building Steps"
                    : selectedType === "land"
                      ? "Land Steps"
                      : "List your property"}
                </span>
              </p>
              <Indicator
                currentStep={newListingState.currentStep}
                steps={steps}
              />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center py-10">
            <Form {...form}>
              <div className="flex w-full max-w-[544px] flex-col gap-4 lg:max-w-full xl:max-w-[544px] xl:p-6">
                <AnimatePresence
                  mode="wait"
                  custom={newListingState.currentStep}
                >
                  <motion.div
                    key={newListingState.currentStep}
                    custom={newListingState.currentStep}
                    variants={{
                      enter: (currentStep: number) => ({
                        y: currentStep > 0 ? 50 : -50,
                      }),
                      center: {
                        y: 0,
                      },
                      exit: (currentStep: number) => ({
                        y: currentStep < 0 ? 50 : -50,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="flex w-full flex-col gap-4"
                  >
                    <div className="flex size-20 items-center justify-center rounded-full border border-[#EAECF0] bg-[#F9FAFB]">
                      <Icon className="size-8 text-primary" />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-xl font-medium text-primary">
                        {title}
                      </p>
                      <p className="flex text-base font-medium text-muted-foreground md:hidden">
                        {subtitle}
                      </p>
                    </div>

                    {!selectedType ? (
                      <PropertyTypeForm setSelectedType={setSelectedType} />
                    ) : selectedType === "building" ? (
                      <BuildingForm />
                    ) : selectedType === "land" ? (
                      <LandForm />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
