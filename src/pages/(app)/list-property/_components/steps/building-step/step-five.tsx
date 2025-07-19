import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { IoImages } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi2";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  buildingFormSchema,
  BuildingFormSchemaProps,
} from "@/utils/validators";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import {
  clearFile,
  getFile,
  resetListingForm,
  setFormStep,
  updateListingFormData,
} from "@/store/slice/new-listing.slice";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { stringToByteArray } from "@/lib/starknet/utils";
import { CairoCustomEnum } from "starknet";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { useUploadFileToPinataHook } from "@/hooks/upload/useUploadFileToPinata.hook";
import { useNavigate } from "react-router-dom";
import React from "react";
import { executeFn } from "@/lib/execute";

export default function BuildingStepFive() {
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

  const form = useForm<BuildingFormSchemaProps>({
    resolver: zodResolver(
      buildingFormSchema.pick({
        floorPlan: true,
        floorPlanCid: true,
        license: true,
        licenseCid: true,
      }),
    ),
    defaultValues: {
      ...storeFormData,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = form;

  React.useEffect(() => {
    (async () => {
      const [savedFloorPlan, savedLicense] = await Promise.all([
        getFile("floorPlan"),
        getFile("license"),
      ]);
      if (savedFloorPlan && savedFloorPlan.length > 0) {
        setValue("floorPlan", savedFloorPlan);
      }
      if (savedLicense && savedLicense.length > 0) {
        setValue("license", savedLicense);
      }
    })();
  }, []);

  async function onSubmit(formData: Partial<BuildingFormSchemaProps>) {
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

      const [imagesCid, videosCid, floorPlanCid, licenseCid] =
        await Promise.all([
          uploadIfExists(formFields.images, "images", (cid) =>
            setValue("imagesCid", cid),
          ),
          uploadIfExists(formFields.videos, "videos", (cid) =>
            setValue("videosCid", cid),
          ),
          uploadIfExists(formFields.floorPlan, "floor plans", (cid) =>
            setValue("floorPlanCid", cid),
          ),
          uploadIfExists(formFields.license, "licenses", (cid) =>
            setValue("licenseCid", cid),
          ),
        ]);

      toast.dismiss(toastId);

      const result = {
        ...formFields,
        imagesCid: imagesCid || undefined,
        videosCid: videosCid || undefined,
        floorPlanCid: floorPlanCid || undefined,
        licenseCid: licenseCid || undefined,
        images: undefined,
        videos: undefined,
        floorPlan: undefined,
        license: undefined,
      };

      if (!result.imagesCid || !result.floorPlanCid || !result.licenseCid) {
        toast.error("UPLOAD_FAILED");
        return;
      }

      toast.success("Files uploaded successfully");
      console.log(result);
      dispatch(updateListingFormData(result));

      const detailsBytes = stringToByteArray(JSON.stringify(result));
      const type = new CairoCustomEnum({ Building: {} });
      // const contractInstance = getContractInstance();
      const contract_ = getWalletProviderContract();
      if (!contract_) {
        throw new Error("Contract instance not available");
      }

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
      // console.log({ callPayload });

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

      // console.log("ENDPOINT CALLED");
      // const txResult = await response.json();

      const txResult = await executeFn({
        entrypoint: "create_listing",
        calldata: [
          type,
          formFields.price!,
          detailsBytes,
        ],
        contract: contract_,
      });

      if (!txResult?.isSuccess()) return;

      // if (!txResult?.success) {
      //   toast.error(txResult?.message);
      //   throw new Error(txResult?.message);
      // }

      form.reset();
      navigate("/properties");
      dispatch(resetListingForm());
      await Promise.all([
        clearFile("images"),
        clearFile("videos"),
        clearFile("license"),
        clearFile("floorPlan"),
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
          name="floorPlan"
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
                      form.setError("floorPlan", {
                        message: "Some files exceed the 5MB size limit",
                      });
                      return;
                    }
                    if (validFiles.length > 10) {
                      form.setError("floorPlan", {
                        message: "You can upload a maximum of 10 files",
                      });
                      return;
                    }
                    form.clearErrors("floorPlan");
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
                            Floor Plan
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
              {errors.floorPlan && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.floorPlan?.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="license"
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
                      (file) => file.size <= 7 * 1024 * 1024,
                    );
                    if (validFiles.length !== files.length) {
                      form.setError("license", {
                        message: "Some files exceed the 7MB size limit",
                      });
                      return;
                    }
                    if (validFiles.length > 3) {
                      form.setError("license", {
                        message: "You can upload a maximum of 3 files",
                      });
                      return;
                    }
                    form.clearErrors("license");
                    field.onChange(validFiles);
                  }}
                  accept="application/pdf"
                  multiple
                >
                  <FileUploadDropzone>
                    <FileUploadTrigger
                      disabled={isSubmitting}
                      aria-disabled={isSubmitting}
                    >
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center justify-center rounded-full border p-4">
                          <HiDocumentText className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Drag & drop{" "}
                          <span className="cursor-pointer font-semibold text-primary underline">
                            License
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
              {errors.license && (
                <p
                  className={cn(
                    "text-sm font-medium text-red-500 dark:text-red-900",
                  )}
                >
                  {errors.license?.message}
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
          List Property
        </Button>
      </div>
    </form>
  );
}
