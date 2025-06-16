import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  buildingFormSchema,
  BuildingFormSchemaProps,
} from "@/utils/validators";
import { FormItem, FormField, FormControl } from "@/components/ui/form";
import { TagsInput } from "@/components/extension/tags-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import {
  setFormStep,
  updateListingFormData,
} from "@/store/slice/new-listing.slice";
import { cn } from "@/lib/utils";

export default function BuildingStepFour() {
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
        interior: true,
        exterior: true,
        utilities: true,
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
          name="interior"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <TagsInput
                  error={!!errors?.interior}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Interior e.g. Modern, Scandinavian, Open Concept"
                />
              </FormControl>
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
              <FormControl>
                <TagsInput
                  error={!!errors?.exterior}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Exterior e.g. Brick, Stucco, Glass Facade"
                />
              </FormControl>
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
              <FormControl>
                <TagsInput
                  error={!!errors?.utilities}
                  value={field.value ?? []}
                  onValueChange={field.onChange}
                  placeholder="Utilities e.g. Electricity, Water, Solar, Internet"
                />
              </FormControl>
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
          Next - Floor plan
        </Button>
      </div>
    </form>
  );
}
