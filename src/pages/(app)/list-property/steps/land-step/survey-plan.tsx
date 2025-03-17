import { AppDispatch, RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { landFormSchema, LandFormSchemaTypes } from "../../list-property.page";
import {
  setCurrentStep,
  updateFormData,
} from "@/store/slice/new-listing.slice";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowDown, UploadIcon, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/extension/file-uploader";
import { DropzoneOptions } from "react-dropzone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function SurveyPlanForm() {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.newListing.formData);

  const form = useForm<LandFormSchemaTypes>({
    resolver: zodResolver(
      landFormSchema.pick({
        landSize: true,
        // boundariesFrom: true,
        // boundariesTo: true,
        surveyDescription: true,
        surveyPlan: true,
        // propertySize: true,
        // yearBuilt: true,
        // plotSize: true,
      }),
    ),
    defaultValues: formData,
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = async (data: Partial<LandFormSchemaTypes>) => {
    dispatch(updateFormData(data));
    dispatch(setCurrentStep(3));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="landSize"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Land size(sqm)"
                  type="number"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.landSize?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.landSize && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.landSize?.message}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* <div className="flex flex-col items-center gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="boundariesFrom"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Boundaries (from)"
                    type="number"
                    className={cn("text-foreground", {
                      "border-red-500 focus-visible:ring-red-500":
                        errors.boundariesFrom?.message,
                    })}
                    {...field}
                  />
                </FormControl>
                {errors.boundariesFrom && (
                  <p
                    className={cn(
                      "text-sm font-medium text-red-500 dark:text-red-900",
                    )}
                  >
                    {errors.boundariesFrom?.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boundariesTo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Boundaries (to)"
                    type="number"
                    className={cn("text-foreground", {
                      "border-red-500 focus-visible:ring-red-500":
                        errors.boundariesTo?.message,
                    })}
                    {...field}
                  />
                </FormControl>
                {errors.boundariesTo && (
                  <p
                    className={cn(
                      "text-sm font-medium text-red-500 dark:text-red-900",
                    )}
                  >
                    {errors.boundariesTo?.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div> */}

        <FormField
          control={form.control}
          name="surveyDescription"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  placeholder="Floor Plan Descriptions"
                  {...field}
                  className={cn("h-[144px] resize-none py-4 text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.surveyDescription?.message,
                  })}
                />
              </FormControl>
              {errors.surveyDescription && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.surveyDescription.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="surveyPlan"
          render={({ field }) => (
            <FormItem>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                dropzoneOptions={
                  {
                    accept: {
                      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
                    },
                    maxFiles: 10,
                    maxSize: 1024 * 1024 * 5,
                    multiple: true,
                  } satisfies DropzoneOptions
                }
                className="relative"
              >
                <FileInput
                  className={cn(
                    "overflow-hidden rounded-md border border-neutral-200 sm:rounded-xl",
                    {
                      "border-red-500": errors.surveyPlan,
                    },
                  )}
                >
                  <div className="flex flex-col gap-4 bg-background p-6">
                    <FormLabel className="text-base font-normal text-muted-foreground">
                      Image of survey Plan
                    </FormLabel>

                    <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-primary/50 bg-[#F8FAFA]">
                      <UploadIcon className="size-10 text-primary/80" />
                      <p className="text-primary">
                        Drag and Drop file here or{" "}
                        <span className="underline">Choose file</span>
                      </p>
                    </div>
                  </div>
                </FileInput>
                <FileUploaderContent>
                  {field.value && field.value.length > 0 && (
                    <ScrollArea className="mt-2 max-h-36 rounded-xl border bg-background px-1 py-2">
                      {field.value.map((file, i) => (
                        <FileUploaderItem
                          key={i}
                          index={i}
                          className="!rounded-md"
                          type="document"
                        >
                          <Paperclip className="size-5" />
                          <span className="text-sm font-medium text-foreground">
                            {file.name}
                          </span>
                        </FileUploaderItem>
                      ))}
                    </ScrollArea>
                  )}
                </FileUploaderContent>
              </FileUploader>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
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
                        format(new Date(field.value), "PPP") // Convert stored ISO string to Date for display
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
          name="plotSize"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Property plot size"
                  type="number"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.plotSize?.message,
                  })}
                  {...field}
                />
              </FormControl>
              {errors.plotSize && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.plotSize?.message}
                </p>
              )}
            </FormItem>
          )}
        /> */}
      </div>

      <Separator className="my-6 h-px w-full" />

      <div className="flex w-full items-center gap-4">
        <Button
          type="button"
          size={"lg"}
          variant={"outline"}
          className="w-[100px] rounded-full"
          onClick={() => dispatch(setCurrentStep(1))}
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
