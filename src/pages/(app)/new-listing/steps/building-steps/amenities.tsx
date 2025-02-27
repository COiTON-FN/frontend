import { AppDispatch, RootState } from "@/store";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  buildingFormSchema,
  BuildingFormSchemaTypes,
} from "../../new-listing.page";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  setCurrentStep,
  updateFormData,
} from "@/store/slice/new-listing.slice";
import { FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Tag, TagInput } from "emblor";
import { useState } from "react";

export default function AmenitiesAndFeatures() {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.newListing.formData);

  const [interiorTags, setInteriorTags] = useState<Tag[]>([]);
  const [exteriorTags, setExteriorTags] = useState<Tag[]>([]);
  const [utilitiesTags, setUtilitiesTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useForm<BuildingFormSchemaTypes>({
    resolver: zodResolver(
      buildingFormSchema.pick({
        interior: true,
        exterior: true,
        utilities: true,
        others: true,
      }),
    ),
    defaultValues: {
      ...formData,
    },
  });

  const {
    formState: { errors },
    setValue,
  } = form;

  const onSubmit = (data: Partial<BuildingFormSchemaTypes>) => {
    dispatch(updateFormData(data));
    dispatch(setCurrentStep(5));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="interior"
          render={({ field }) => (
            <FormItem className="w-full">
              <TagInput
                {...field}
                placeholder="Interior Details"
                tags={interiorTags}
                className="sm:min-w-[450px]"
                setTags={(newTags) => {
                  setInteriorTags(newTags);
                  setValue("interior", newTags as [Tag, ...Tag[]]);
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
                styleClasses={{
                  input:
                    "border-0 focus:ring-0 shadow-none text-base h-16 py-0",
                  inlineTagsContainer:
                    "border-neutral-200 rounded-md sm:rounded-xl px-4 max-h-[144px] overflow-y-auto",
                  tagPopover: {
                    popoverContent: "bg-white shadow-lg",
                    popoverTrigger: "text-blue-500 hover:text-blue-600",
                  },
                  tagList: {
                    container: "bg-red-100",
                    sortableList: "p-1",
                  },
                  autoComplete: {
                    command: "bg-blue-100",
                    popoverTrigger: "bg-green-200",
                    popoverContent: "p-4",
                    commandList: "list-none",
                    commandGroup: "font-bold",
                    commandItem: "cursor-pointer hover:bg-gray-100",
                  },
                  tag: {
                    body: "flex items-center gap-2",
                    closeButton: "text-red-500 hover:text-red-600",
                  },
                  clearAllButton: "text-red-500 hover:text-red-600",
                }}
              />

              {errors.interior && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.interior?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exterior"
          render={({ field }) => (
            <FormItem className="w-full">
              <TagInput
                {...field}
                placeholder="Outdoor Details"
                tags={exteriorTags}
                className="sm:min-w-[450px]"
                setTags={(newTags) => {
                  setExteriorTags(newTags);
                  setValue("exterior", newTags as [Tag, ...Tag[]]);
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
                styleClasses={{
                  input:
                    "border-0 focus:ring-0 shadow-none text-base h-16 py-0",
                  inlineTagsContainer:
                    "border-neutral-200 rounded-md sm:rounded-xl px-4 max-h-[144px] overflow-y-auto",
                  tagPopover: {
                    popoverContent: "bg-white shadow-lg",
                    popoverTrigger: "text-blue-500 hover:text-blue-600",
                  },
                  tagList: {
                    container: "bg-red-100",
                    sortableList: "p-1",
                  },
                  autoComplete: {
                    command: "bg-blue-100",
                    popoverTrigger: "bg-green-200",
                    popoverContent: "p-4",
                    commandList: "list-none",
                    commandGroup: "font-bold",
                    commandItem: "cursor-pointer hover:bg-gray-100",
                  },
                  tag: {
                    body: "flex items-center gap-2",
                    closeButton: "text-red-500 hover:text-red-600",
                  },
                  clearAllButton: "text-red-500 hover:text-red-600",
                }}
              />

              {errors.exterior && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.exterior?.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="utilities"
          render={({ field }) => (
            <FormItem className="w-full">
              <TagInput
                {...field}
                placeholder="Utilities"
                tags={utilitiesTags}
                className="sm:min-w-[450px]"
                setTags={(newTags) => {
                  setUtilitiesTags(newTags);
                  setValue("utilities", newTags as [Tag, ...Tag[]]);
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
                styleClasses={{
                  input:
                    "border-0 focus:ring-0 shadow-none text-base h-16 py-0",
                  inlineTagsContainer:
                    "border-neutral-200 rounded-md sm:rounded-xl px-4 max-h-[144px] overflow-y-auto",
                  tagPopover: {
                    popoverContent: "bg-white shadow-lg",
                    popoverTrigger: "text-blue-500 hover:text-blue-600",
                  },
                  tagList: {
                    container: "bg-red-100",
                    sortableList: "p-1",
                  },
                  autoComplete: {
                    command: "bg-blue-100",
                    popoverTrigger: "bg-green-200",
                    popoverContent: "p-4",
                    commandList: "list-none",
                    commandGroup: "font-bold",
                    commandItem: "cursor-pointer hover:bg-gray-100",
                  },
                  tag: {
                    body: "flex items-center gap-2",
                    closeButton: "text-red-500 hover:text-red-600",
                  },
                  clearAllButton: "text-red-500 hover:text-red-600",
                }}
              />

              {errors.utilities && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.utilities?.message}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-6 h-px w-full" />

      <div className="flex w-full items-center gap-4">
        <Button
          type="button"
          size={"lg"}
          variant={"outline"}
          className="w-[100px] rounded-full"
          onClick={() => dispatch(setCurrentStep(3))}
        >
          Back
        </Button>
        <Button type="submit" size={"lg"} className="flex-1 rounded-full">
          <span>Next</span>
          <ArrowDown className="size-5" />
        </Button>
      </div>
    </form>
  );
}
