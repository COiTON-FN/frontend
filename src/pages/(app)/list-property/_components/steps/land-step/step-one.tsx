import * as React from "react";

import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { IoImages } from "react-icons/io5";
import { PiVideoDuotone } from "react-icons/pi";
import { zodResolver } from "@hookform/resolvers/zod";

import { landFormSchema, LandFormSchemaProps } from "@/utils/validators";
import { FormItem, FormField, FormControl } from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/extension/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import {
  getFile,
  setFormStep,
  updateListingFormData,
} from "@/store/slice/new-listing.slice";
import { cn } from "@/lib/utils";

export default function LandStepOne({
  propertyType,
}: {
  propertyType: string;
}) {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(
    (state: RootState) => state.newListing.formStep,
  );
  const storeFormData = useAppSelector(
    (state: RootState) => state.newListing.formData,
  );

  const form = useForm<LandFormSchemaProps>({
    resolver: zodResolver(
      landFormSchema.pick({
        title: true,
        images: true,
        imagesCid: true,
        videos: true,
        videosCid: true,
        description: true,
        propertyType: true,
      }),
    ),
    defaultValues: {
      ...storeFormData,
      propertyType: propertyType,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  React.useEffect(() => {
    setValue("propertyType", propertyType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("propertyType")]);

  React.useEffect(() => {
    (async () => {
      const [savedImages, savedVideos] = await Promise.all([
        getFile("images"),
        getFile("videos"),
      ]);
      if (savedImages && savedImages.length > 0) {
        setValue("images", savedImages);
      }
      if (savedVideos && savedVideos.length > 0) {
        setValue("videos", savedVideos);
      }
    })();
  }, []);

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
          name="title"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem aria-disabled={isSubmitting} className="w-full">
              <FormControl aria-disabled={isSubmitting}>
                <Input
                  {...field}
                  type="text"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                  placeholder="What's the name of your property?"
                  error={!!errors?.title}
                />
              </FormControl>
              {errors.title && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.title?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem aria-disabled={isSubmitting} className="w-full">
              <FormControl aria-disabled={isSubmitting}>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                  error={!!errors?.description}
                  placeholder="Give a brief overview. What makes it stand out?"
                  className="resize-none py-4 text-foreground"
                />
              </FormControl>
              {errors.description && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.description?.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem aria-disabled={isSubmitting}>
              <FormControl aria-disabled={isSubmitting}>
                <FileUpload
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                  value={field.value}
                  onValueChange={(files) => {
                    const validFiles = files.filter(
                      (file) => file.size <= 5 * 1024 * 1024,
                    );
                    if (validFiles.length !== files.length) {
                      form.setError("images", {
                        message: "Some files exceed the 5MB size limit",
                      });
                      return;
                    }
                    if (validFiles.length > 10) {
                      form.setError("images", {
                        message: "You can upload a maximum of 10 files",
                      });
                      return;
                    }
                    form.clearErrors("images");
                    field.onChange(validFiles);
                  }}
                  accept="image/*"
                  multiple
                >
                  <FileUploadDropzone>
                    <FileUploadTrigger
                      disabled={isSubmitting}
                      aria-disabled={isSubmitting}
                    >
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center justify-center rounded-full border p-4">
                          <IoImages className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Drag & drop{" "}
                          <span className="cursor-pointer font-semibold text-primary underline">
                            images
                          </span>{" "}
                          here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Or click to browse (max 10 files, up to 5MB each)
                        </p>
                      </div>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadList>
                    <ScrollArea className="max-h-[180px] rounded-lg bg-secondary p-2.5">
                      {field.value &&
                        field.value.map((file, index) => (
                          <FileUploadItem
                            key={index}
                            value={file}
                            className="mb-2 bg-background last-of-type:mb-0"
                          >
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                              >
                                <IoClose />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                    </ScrollArea>
                  </FileUploadList>
                </FileUpload>
              </FormControl>
              {errors.images && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.images?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videos"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem aria-disabled={isSubmitting}>
              <FormControl aria-disabled={isSubmitting}>
                <FileUpload
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                  value={field.value}
                  onValueChange={(files) => {
                    const validFiles = files.filter(
                      (file) => file.size <= 50 * 1024 * 1024,
                    );
                    if (validFiles.length !== files.length) {
                      form.setError("videos", {
                        message: "Some files exceed the 50MB size limit",
                      });
                      return;
                    }
                    if (validFiles.length > 1) {
                      form.setError("videos", {
                        message: "You can upload a maximum of 1 files",
                      });
                      return;
                    }
                    form.clearErrors("videos");
                    field.onChange(validFiles);
                  }}
                  accept="video/*"
                >
                  <FileUploadDropzone>
                    <FileUploadTrigger
                      disabled={isSubmitting}
                      aria-disabled={isSubmitting}
                    >
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center justify-center rounded-full border p-4">
                          <PiVideoDuotone className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Drag & drop{" "}
                          <span className="cursor-pointer font-semibold text-primary underline">
                            Video
                          </span>{" "}
                          here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Or click to browse (max 1 files, up to 50MB each)
                        </p>
                      </div>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadList>
                    <ScrollArea className="max-h-[180px] rounded-lg bg-secondary p-2.5">
                      {field.value &&
                        field.value.map((file, index) => (
                          <FileUploadItem
                            key={index}
                            value={file}
                            className="mb-2 bg-background last-of-type:mb-0"
                          >
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                              >
                                <IoClose />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                    </ScrollArea>
                  </FileUploadList>
                </FileUpload>
              </FormControl>
              {errors.videos && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.videos?.message}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>

      <Separator orientation="horizontal" className="mx-auto my-8 w-[80%]" />

      <div className="flex w-full items-center gap-4">
        <Button
          type="submit"
          size={"lg"}
          isLoading={isSubmitting}
          txt="Submitting"
          className="flex-1"
        >
          Next - Addresses
        </Button>
      </div>
    </form>
  );
}
