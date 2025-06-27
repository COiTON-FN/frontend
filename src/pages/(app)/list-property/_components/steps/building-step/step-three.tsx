import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  buildingFormSchema,
  BuildingFormSchemaProps,
} from "@/utils/validators";
import { FormItem, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import {
  setFormStep,
  updateListingFormData,
} from "@/store/slice/new-listing.slice";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function BuildingStepThree() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(
    (state: RootState) => state.newListing.formStep,
  );
  const storeFormData = useAppSelector(
    (state: RootState) => state.newListing.formData,
  );

  const form = useForm<BuildingFormSchemaProps>({
    resolver: zodResolver(
      buildingFormSchema.pick({
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
      ...storeFormData,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(formData: Partial<BuildingFormSchemaProps>) {
    dispatch(setFormStep(currentStep + 1));
    dispatch(updateListingFormData(formData));
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col"
    >
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="price"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="How much does this property worth?"
                  error={!!errors?.price}
                />
              </FormControl>
              {errors.price && (
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
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Number of rooms"
                  error={!!errors?.rooms}
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
        <div className="flex w-full items-center gap-4">
          <FormField
            control={form.control}
            name="bedrooms"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Number of bedrooms"
                    error={!!errors?.bedrooms}
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
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Number of bathrooms"
                    error={!!errors?.bathrooms}
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
        </div>

        <FormField
          control={form.control}
          name="yearBuilt"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <div
                      className={cn(
                        "flex h-12 w-full items-center rounded-md border border-neutral-200 bg-background px-5 py-2 text-left text-sm sm:h-14 sm:rounded-xl sm:text-[15px]",
                        {
                          "border-red-500": errors.yearBuilt,
                        },
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP") // Convert stored ISO string to Date for display
                      ) : (
                        <span className="text-muted-foreground">
                          What year was this property built?
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
                  {errors.yearBuilt?.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertySize"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Property Sizes (Square meters)"
                  error={!!errors?.propertySize}
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
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="What is the structure type?"
                  error={!!errors?.structureType}
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

      <Separator orientation="horizontal" className="mx-auto my-8 w-[80%]" />

      <div className="flex w-full items-center gap-4">
        <Button
          type="button"
          variant={"outline"}
          size={"lg"}
          disabled={isSubmitting}
          className="w-max"
          onClick={() => dispatch(setFormStep(currentStep - 1))}
        >
          Back
        </Button>
        <Button
          type="submit"
          size={"lg"}
          isLoading={isSubmitting}
          txt="Submitting"
          className="flex-1"
        >
          Next - Features
        </Button>
      </div>
    </form>
  );
}
