import { AppDispatch, RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  buildingFormSchema,
  BuildingFormSchemaTypes,
} from "../../list-property.page";
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
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";

export default function BasicsForm() {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.newListing.formData);

  const form = useForm<BuildingFormSchemaTypes>({
    resolver: zodResolver(
      buildingFormSchema.pick({
        title: true,
        images: true,
        videos: true,
        description: true,
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
    dispatch(setCurrentStep(2));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Title"
                  type="text"
                  className={cn("text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.title?.message,
                  })}
                  {...field}
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
          name="images"
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
                      "border-red-500": errors.images,
                    },
                  )}
                >
                  <div className="flex flex-col gap-4 bg-background p-6">
                    <FormLabel className="text-base font-normal text-muted-foreground">
                      Upload Images
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

        <FormField
          control={form.control}
          name="videos"
          render={({ field }) => (
            <FormItem>
              <FileUploader
                value={field.value!}
                onValueChange={field.onChange}
                dropzoneOptions={
                  {
                    accept: {
                      "video/*": [".mp4", ".mov", ".avi"],
                    },
                    maxFiles: 3,
                    maxSize: 1024 * 1024 * 40,
                    multiple: true,
                  } satisfies DropzoneOptions
                }
                className="relative"
              >
                <FileInput
                  className={cn(
                    "overflow-hidden rounded-md border border-neutral-200 sm:rounded-xl",
                    {
                      "border-red-500": errors.videos,
                    },
                  )}
                >
                  <div className="flex flex-col gap-4 bg-background p-6">
                    <FormLabel className="text-base font-normal text-muted-foreground">
                      Upload Video
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  placeholder="Property Description"
                  {...field}
                  className={cn("h-[144px] resize-none py-4 text-foreground", {
                    "border-red-500 focus-visible:ring-red-500":
                      errors.description?.message,
                  })}
                />
              </FormControl>
              {errors.description && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.description.message}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-6 h-px w-full" />

      <div className="flex w-full items-center gap-4">
        <Button type="submit" size={"lg"} className="flex-1 rounded-full">
          <span>Next</span>
          <ArrowDown className="size-5" />
        </Button>
      </div>
    </form>
  );
}
