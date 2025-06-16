import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { landFormSchema, LandFormSchemaProps } from "@/utils/validators";
import {
  FormItem,
  FormField,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import {
  setFormStep,
  updateListingFormData,
} from "@/store/slice/new-listing.slice";
import LocationSelector from "@/components/extension/location-input";
import MapPicker from "@/components/shared/map-picker";
import { cn } from "@/lib/utils";

export default function LandStepTwo() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(
    (state: RootState) => state.newListing.formStep,
  );
  const storeFormData = useAppSelector(
    (state: RootState) => state.newListing.formData,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCountryName] = React.useState<string>("");
  const [stateName, setStateName] = React.useState<string>("");

  const form = useForm<LandFormSchemaProps>({
    resolver: zodResolver(
      landFormSchema.pick({
        region: true,
        zip: true,
        landmark: true,
        area: true,
        map: true,
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

  async function onSubmit(formData: Partial<LandFormSchemaProps>) {
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
          name="region"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <LocationSelector
                  onCountryChange={(country) => {
                    setCountryName(country?.name || "");
                    form.setValue(field.name, [
                      country?.name || "",
                      stateName || "",
                    ]);
                  }}
                  onStateChange={(state) => {
                    setStateName(state?.name || "");
                    form.setValue(field.name, [
                      form.getValues(field.name)[0] || "",
                      state?.name || "",
                    ]);
                  }}
                  disabled={isSubmitting}
                  error={!!errors.region?.[0]}
                />
              </FormControl>
              <FormDescription>
                If your country has states, it will be appear after selecting
                country
              </FormDescription>
              {errors.region && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.region?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Post Code"
                  error={!!errors?.zip}
                />
              </FormControl>
              {errors.zip && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.zip?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="landmark"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nearest landmark"
                  error={!!errors?.landmark}
                />
              </FormControl>
              {errors.landmark && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.landmark?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="area"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Area your property is located"
                  error={!!errors?.area}
                />
              </FormControl>
              {errors.area && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.area?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="map"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex items-center gap-2">
                  <MapPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors?.map}
                  />
                </div>
              </FormControl>
              {errors.map && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors?.map?.message}
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
          Next - Details
        </Button>
      </div>
    </form>
  );
}
