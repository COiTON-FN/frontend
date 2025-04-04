import { AppDispatch, RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { landFormSchema, LandFormSchemaTypes } from "../../list-property.page";
import {
  resetForm,
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
import { apiClient, cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowDown, UploadIcon, Paperclip, Loader } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/extension/file-uploader";
import { DropzoneOptions } from "react-dropzone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFileToPinataHook } from "@/hooks/upload/useUploadFileToPinata.hook";
import { toast } from "sonner";
import { useState } from "react";
import { CairoCustomEnum, GetTransactionReceiptResponse } from "starknet";
import { byteArrayToString, stringToByteArray } from "@/lib/starknet/utils";
import { useNavigate } from "react-router-dom";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { User } from "@/store/slice/credential.slice";
import { addListing, Listing } from "@/store/slice/listing.slice";


export default function BasicsForm() {

  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.newListing.formData);



  const form = useForm<LandFormSchemaTypes>({
    resolver: zodResolver(
      landFormSchema.pick({
        title: true,
        images: true,
        videos: true,
        price: true,
        description: true,
      }),
    ),
    defaultValues: {
      ...formData,
    },
  });

  const {
    setValue,

    formState: { errors },
  } = form;
  const { onUpload } = useUploadFileToPinataHook();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getContractInstance } = useContractInstance()

  const onSubmit = async (data: Partial<LandFormSchemaTypes>) => {
    if (loading) return;
    const formFields = {
      ...formData,
      ...data,
    };
    dispatch(updateFormData(formFields));

    try {
      setLoading(true);
      const toastId = toast.loading("Uploading files...");
      // Upload files only if they exist
      let imagesCid: string[] | null = null;
      let videosCid: string[] | null = null;
      let surveyPlanCid: string[] | null = null;

      if (formFields.images && formFields.images.length > 0) {
        imagesCid = await onUpload(formFields.images);
        if (!imagesCid || imagesCid.length === 0) {
          toast.error("Failed to upload images. Please try again.");
          throw new Error("Image upload failed");
        }
        setValue("imagesCid", imagesCid);
      }

      if (formFields.videos && formFields.videos.length > 0) {
        videosCid = await onUpload(formFields.videos);
        if (!videosCid || videosCid.length === 0) {
          toast.error("Failed to upload videos. Please try again.");
          throw new Error("Video upload failed");
        }
        setValue("videosCid", videosCid);
      }

      if (formFields.surveyPlan && formFields.surveyPlan.length > 0) {
        surveyPlanCid = await onUpload(formFields.surveyPlan);
        if (!surveyPlanCid || surveyPlanCid.length === 0) {
          toast.error("Failed to upload floor plans. Please try again.");
          throw new Error("Floor plan upload failed");
        }
        setValue("surveyPlanCid", surveyPlanCid);
      }

      toast.dismiss(toastId)


      // Prepare the result object with the uploaded CIDs
      const result = {
        ...formFields,
        imagesCid: imagesCid || undefined,
        videosCid: videosCid || undefined,
        surveyPlanCid: surveyPlanCid || undefined,
        images: undefined,
        videos: undefined,
        surveyPlan: undefined
      };
      if (!result.imagesCid || !result.videosCid || !result.surveyPlanCid) {
        toast.error("UPLOAD_FAILED");
        setLoading(false);
        return;
      }

      toast.success("Files uploaded successfully");


      dispatch(updateFormData(result));

      // Send transaction
      try {
        // await listingTx.sendAsync();
        const contract = getContractInstance();
        const detailsBytes = stringToByteArray(JSON.stringify(result));
        const type = new CairoCustomEnum({ Land: {} })
        const call = contract!.populate("create_listing", [
          type,
          formFields.price!,
          detailsBytes,
        ])


        const tx = await window.Wallet.Account!.execute([call]);
        const receipt = await window.Wallet.Account?.waitForTransaction(tx.transaction_hash);
        apiClient.post("/listing", { tx_hash: tx.transaction_hash });
        console.log("Receipt:", receipt);




        if (receipt?.isSuccess()) {
          toast.success("Listing created successfully!");
          dispatch(resetForm());
          navigate("/dashboard");
          const events = contract?.parseEvents(receipt as GetTransactionReceiptResponse);
          const id = events![0][Object.keys(events![0])[0]].id;
          const new_listing = await contract!.get_listing(id);
          const user = new_listing.owner_details.Some;
          const user_construct: User = {
            ...user,
            address: BigInt(user.address).toString(16),
            id: Number(user.id),
            details: byteArrayToString(user.details),
            user_type: user.user_type.variant.Entity ? "Entity" : "Individual"
          }

          const structured: Listing = {
            id: Number(new_listing.id),
            owner: BigInt(new_listing.owner).toString(16),
            price: Number(new_listing.price),
            tag: new_listing.tag.variant.Sold ? "Sold" : "ForSale",
            details: byteArrayToString(new_listing.details),
            owner_details: user_construct
          };
          dispatch(addListing(structured));
        } else {
          toast.error("Failed to create listing. Please try again.");
        }
        setLoading(false);

      } catch (error) {
        setLoading(false);

        console.error("Transaction error:", error);
        toast.error("Transaction failed. Please try again.");
      } finally {
        toast.dismiss();
      }
    } catch (error) {
      setLoading(false);
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong during submission.",
      );
      toast.dismiss();
    }
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
        <Button
          type="button"
          size={"lg"}
          variant={"outline"}
          className="w-[100px] rounded-full"
          onClick={() => dispatch(setCurrentStep(2))}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          disabled={loading}
          type="submit"
          size={"lg"}
          className="flex-1 rounded-full"
        >
          {loading ? (
            <>
              <span>Please wait</span>
              <Loader className="size-5 animate-spin" />
            </>
          ) : (
            <>
              <span>Finish</span>
              <ArrowDown className="size-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
