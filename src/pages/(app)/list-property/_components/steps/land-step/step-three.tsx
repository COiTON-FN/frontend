import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { landFormSchema, LandFormSchemaProps } from "@/utils/validators";
import { FormItem, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import {
  clearFile,
  getFile,
  resetListingForm,
  setFormStep,
  updateListingFormData,
} from "@/store/slice/new-listing.slice";
import { cn, formatUnits, lcStorage } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
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
import { IoClose, IoImages } from "react-icons/io5";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import React from "react";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { useUploadFileToPinataHook } from "@/hooks/upload/useUploadFileToPinata.hook";
import { stringToByteArray } from "@/lib/starknet/utils";
import { CairoCustomEnum, } from "starknet";
import { useNavigate } from "react-router-dom";
import { executeFn } from "@/lib/execute";

export default function LandStepThree() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(
    (state: RootState) => state.newListing.formStep,
  );
  const storeFormData = useAppSelector(
    (state: RootState) => state.newListing.formData,
  );

  const { getWalletProviderContract } = useContractInstance();
  const { onUpload } = useUploadFileToPinataHook();

  const form = useForm<LandFormSchemaProps>({
    resolver: zodResolver(
      landFormSchema.pick({
        price: true,
        landSize: true,
        surveyDescription: true,
        surveyPlan: true,
        surveyPlanCid: true,
      }),
    ),
    defaultValues: {
      ...storeFormData,
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  React.useEffect(() => {
    (async () => {
      const [savedSurveyPlan] = await Promise.all([getFile("surveyPlan")]);
      if (savedSurveyPlan && savedSurveyPlan.length > 0) {
        setValue("surveyPlan", savedSurveyPlan);
      }
    })();
  }, []);

  async function onSubmit(formData: Partial<LandFormSchemaProps>) {
    const formFields = { ...formData, ...storeFormData };
    dispatch(updateListingFormData(formFields));

    const toastId = toast.loading("Uploading files...");

    try {
      const uploadIfExists = async (
        files: File[] | undefined,
        label: string,
        setCid: (cid: string[]) => void,
      ): Promise<string[] | null> => {
        if (!files || files.length === 0) return null;

        const cid = await onUpload(files);
        if (!cid || cid.length === 0) {
          toast.error(`Failed to upload ${label}. Please try again.`);
          throw new Error(`${label} upload failed`);
        }

        setCid(cid);
        return cid;
      };

      const [imagesCid, videosCid, surveyPlan] = await Promise.all([
        uploadIfExists(formFields.images, "images", (cid) =>
          setValue("imagesCid", cid),
        ),
        uploadIfExists(formFields.videos, "videos", (cid) =>
          setValue("videosCid", cid),
        ),
        uploadIfExists(formFields.surveyPlan, "survey plans", (cid) =>
          setValue("surveyPlanCid", cid),
        ),
      ]);

      toast.dismiss(toastId);

      const result = {
        ...formFields,
        imagesCid: imagesCid || undefined,
        videosCid: videosCid || undefined,
        surveyPlan: surveyPlan || undefined,
        images: undefined,
        videos: undefined,
      };

      if (!result.imagesCid || !result.surveyPlan) {
        toast.error("UPLOAD_FAILED");
        return;
      }

      toast.success("Files uploaded successfully");
      console.log(result);
      dispatch(updateListingFormData(result));

      const detailsBytes = stringToByteArray(JSON.stringify(result));
      const type = new CairoCustomEnum({ Land: {} });
      // const contractInstance = getContractInstance();

      const contract_ = getWalletProviderContract();
      if (!contract_) {
        throw new Error("Contract instance not available");

      }


      const txResult = await executeFn({
        // contractAddress: contract.daoAddress,
        entrypoint: "create_listing",
        calldata: [
          type,
          formatUnits(formFields.price!.toString()),
          detailsBytes,
        ],
        contract: contract_,
      });

      if (!txResult?.isSuccess()) return;

      // const calls: Call = contractInstance.populate("create_listing", [
      // type,
      // formFields.price!,
      // detailsBytes,
      // ]);

      // const account = window.Wallet.Account;
      // if (!account) {
      //   throw new Error("Wallet not connected!");
      // }

      // const callPayload = await account.getOutsideExecutionPayload({
      //   calls: [calls],
      // });

      // const response = await fetch(
      //   `${variables.renderEndpoint}/contract/execute`,
      //   {
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //     method: "POST",
      //     body: JSON.stringify(callPayload),
      //     redirect: "follow",
      //   },
      // );

      // const txResult = await response.json();

      // if (!txResult?.success) {
      //   toast.error(txResult?.message);
      //   throw new Error(txResult?.message);
      // }

      form.reset();
      navigate("/properties");
      dispatch(resetListingForm());
      lcStorage.clear("new_listing");
      await Promise.all([
        clearFile("images"),
        clearFile("videos"),
        clearFile("surveyPlan"),
      ]);
      return txResult;
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong during submission.",
      );
    } finally {
      toast.dismiss();
    }
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
          name="landSize"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Land Size (Square meters)"
                  error={!!errors?.landSize}
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
        <FormField
          control={form.control}
          name="surveyDescription"
          disabled={isSubmitting}
          render={({ field }) => (
            <FormItem aria-disabled={isSubmitting} className="w-full">
              <FormControl aria-disabled={isSubmitting}>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                  error={!!errors?.surveyDescription}
                  placeholder="Survey description"
                  className="resize-none py-4 text-foreground"
                />
              </FormControl>
              {errors.surveyDescription && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.surveyDescription?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surveyPlan"
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
                      form.setError("surveyPlan", {
                        message: "Some files exceed the 5MB size limit",
                      });
                      return;
                    }
                    if (validFiles.length > 3) {
                      form.setError("surveyPlan", {
                        message: "You can upload a maximum of 3 files",
                      });
                      return;
                    }
                    form.clearErrors("surveyPlan");
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
                            Survey Plan
                          </span>{" "}
                          here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Or click to browse (max 3 files, up to 5MB each)
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
              {errors.surveyPlan && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.surveyPlan?.message}
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
