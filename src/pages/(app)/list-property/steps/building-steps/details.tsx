import { AppDispatch, RootState } from "@/store";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  buildingFormSchema,
  BuildingFormSchemaTypes,
} from "../../list-property.page";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  setCurrentStep,
  updateFormData,
} from "@/store/slice/new-listing.slice";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowDown, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export default function DetailsForm() {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.newListing.formData);

  const form = useForm<BuildingFormSchemaTypes>({
    resolver: zodResolver(
      buildingFormSchema.pick({
        // rangeFrom: true,
        // rangeTo: true,
        price: true,
        rooms: true,
        bathrooms: true,
        bedrooms: true,
        yearBuilt: true,
        structureType: true,
        propertySize: true,
      }),
    ),
    defaultValues: {
      ...formData,
    },
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = (data: Partial<BuildingFormSchemaTypes>) => {
    dispatch(updateFormData(data));
    dispatch(setCurrentStep(4));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-3">
        {/* <div className="flex flex-col items-center gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="rangeFrom"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Price Range (from)"
                    type="number"
                    className={cn("text-foreground", {
                      "border-red-500 focus-visible:ring-red-500":
                        errors.rangeFrom?.message,
                    })}
                    {...field}
                  />
                </FormControl>
                {errors.rangeFrom && (
                  <p
                    className={cn(
                      "text-sm font-medium text-red-500 dark:text-red-900",
                    )}
                  >
                    {errors.rangeFrom?.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rangeTo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Price Range (to)"
                    type="number"
                    className={cn("text-foreground", {
                      "border-red-500 focus-visible:ring-red-500":
                        errors.rangeTo?.message,
                    })}
                    {...field}
                  />
                </FormControl>
                {errors.rangeTo && (
                  <p
                    className={cn(
                      "text-sm font-medium text-red-500 dark:text-red-900",
                    )}
                  >
                    {errors.rangeTo?.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div> */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Price"
                  type="number"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.price?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.rooms && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.price?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rooms"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Room(s)"
                  type="number"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.rooms?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.rooms && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.rooms?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Bedroom(s)"
                  type="number"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.bedrooms?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.bedrooms && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.bedrooms?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Bathroom(s)"
                  type="number"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.bathrooms?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.bathrooms && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.bathrooms?.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearBuilt"
          render={({ field }) => (
            <FormItem className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <div
                      className={cn(
                        "flex h-12 w-full items-center rounded-md border border-neutral-200 bg-background px-5 py-2 text-left text-sm sm:h-14 sm:rounded-xl sm:text-base",
                        {
                          "border-red-500": errors.yearBuilt,
                        },
                      )}
                    >
                      {field.value ? (
                        formatDate(new Date(field.value).toISOString()) // Convert stored ISO string to Date for display
                      ) : (
                        <span className="text-muted-foreground">
                          Year built
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined} // Handle potential string format
                    onSelect={(date) => {
                      field.onChange(date?.toISOString() || null); // Save ISO string to state
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {errors.yearBuilt && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.yearBuilt.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertySize"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Property Sizes (Square meters)"
                  type="number"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.propertySize?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.propertySize && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.propertySize?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="structureType"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Structure Type"
                  type="text"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.structureType?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.structureType && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.structureType?.message}
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
          onClick={() => dispatch(setCurrentStep(2))}
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
