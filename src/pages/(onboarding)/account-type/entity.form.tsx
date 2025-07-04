import * as React from "react";
import { motion } from "framer-motion";
import { assets } from "@/assets";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/extension/file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { PhoneInput } from "@/components/extension/phone-input";
import { formatPhoneNumber } from "react-phone-number-input";
import LocationSelector from "@/components/extension/location-input";
import SocialInput from "@/components/extension/social-input";
import { useWalletHook } from "@/hooks/useWallet.hook";
import { setCredential, User } from "@/store/slice/credential.slice";
import { stringToByteArray } from "@/lib/starknet/utils";
import { executeFn } from "@/lib/execute";
// import { contract } from "@/utils/contract";
import { setHasRegistered } from "@/store/slice/wallet.slice";
import { Upload, X } from "lucide-react";
import { useUploadFileToPinataHook } from "@/hooks/upload/useUploadFileToPinata.hook";
import { useContractInstance } from "@/hooks/useContractInstance.hook";

const entityFormSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must not exceed 30 characters"),
  email: z.coerce
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" })
    .min(3, "Email must be at least 3 characters"),
  phone: z
    .object({
      national: z
        .string({ required_error: "Phone number is required" })
        .min(1, "Phone number is required"),
      international: z.string().optional(),
    })
    .required(),
  region: z
    .tuple(
      [
        z
          .string({ required_error: "Country is required" })
          .min(2, "Country is required"),
        z.string().optional(),
      ],
      {
        required_error: "Please select country",
      },
    )
    .refine(([country]) => !!country, {
      message: "Please select country",
    }),
  socials: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().url("Please enter a valid URL"),
        type: z.enum([
          "twitter",
          "instagram",
          "telegram",
          "facebook",
          "linkedin",
          "other",
        ]),
      }),
      {
        required_error: "Please add at least one social media",
      },
    )
    .min(1, "At least one social media is required")
    .max(6, {
      message: "You can only add up to 6 social media",
    }),
  license: z
    .array(z.custom<File>())
    .min(1, "Please select at least one file")
    .max(3, "Please select up to 3 files")
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
      message: "File size must be less than 5MB",
      path: ["files"],
    }),
});

type EntityFormSchemaProps = z.infer<typeof entityFormSchema>;

export default function EntityForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleConnectWallet } = useWalletHook();
  const { onUpload } = useUploadFileToPinataHook();
  const { getWalletProviderContract } = useContractInstance();
  const walletStore = useAppSelector((state: RootState) => state.wallet);
  const credentialStore = useAppSelector(
    (state: RootState) => state.credential.credential,
  );

  const [countryName, setCountryName] = React.useState<string>("");
  const [stateName, setStateName] = React.useState<string>("");

  const form = useForm<EntityFormSchemaProps>({
    resolver: zodResolver(entityFormSchema),
    defaultValues: {
      name: "",
      email: credentialStore?.details?.email ?? "",
      phone: {
        national: "",
        international: "",
      },
      region: undefined,
      socials: undefined,
      license: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  React.useEffect(() => {
    const number = formatPhoneNumber(form.watch("phone.national"));
    form.setValue("phone.international", number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("phone.national")]);

  async function onSubmit(formData: EntityFormSchemaProps) {
    try {
      if (!walletStore.isWalletConnected) {
        await handleConnectWallet();
      }

      let licenseCid: string[] | null = null;

      licenseCid = await onUpload(formData.license);

      // const userType = new CairoCustomEnum({ Entity: {} });
      const processed_data = { ...formData, ...{ licenseCid } };
      console.log(processed_data);
      const detailsToBytesArray = stringToByteArray(
        JSON.stringify(processed_data),
      );
      const contract_ = getWalletProviderContract();


      const result = await executeFn({
        // contractAddress: contract.daoAddress,
        entrypoint: "register",
        calldata: [1, detailsToBytesArray],
        contract: contract_

      });

      if (!result?.success) return;

      const account = window.Wallet.Account;

      const user_construct: User = {
        address: account?.address as string,
        details: processed_data,
        registered: true,
        user_type: "Entity",
        verified: false,
      };
      dispatch(setCredential(user_construct));
      dispatch(setHasRegistered(true));

      navigate("/dashboard");
    } catch (error) {
      console.error("Unexpected error during transaction:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  }

  React.useEffect(() => {
    if (credentialStore && credentialStore?.registered) {
      navigate("/dashboard");
    }
  }, [credentialStore, credentialStore?.registered, navigate]);

  return (
    <div className="flex lg:h-full">
      <Form {...form}>
        <motion.form
          variants={{
            enter: (currentStep: number) => ({
              x: currentStep > 0 ? -100 : 100, // Enter from left if moving forward, right if going back
              opacity: 0,
            }),
            center: {
              x: 0, // Centered position
              opacity: 1,
            },
            exit: (currentStep: number) => ({
              x: currentStep > 0 ? 100 : -100, // Exit to right if moving forward, left if going back
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { duration: 0.5, ease: "linear" },
            opacity: { duration: 0.5, ease: "linear" },
          }}
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full items-center justify-center overflow-y-auto p-6 lg:max-w-[55%]"
        >
          <div className="flex w-full max-w-[480px] flex-col gap-4">
            <div className="mb-4 flex flex-col sm:mb-0 sm:gap-2">
              <p className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
                Register as an Entity
              </p>
              <p className="text-base font-normal text-muted-foreground sm:text-lg">
                Upload your license so we can verify and make you a proper dao
                member.
              </p>
            </div>

            <FormField
              control={control}
              name="name"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      type="text"
                      error={!!errors.name}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!credentialStore?.details?.email && (
              <FormField
                control={control}
                name="email"
                disabled={isSubmitting}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Enter your email address"
                        type="email"
                        error={!!errors.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Please provide the same email address you used to register
                      your wallet.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name="phone.national"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <PhoneInput
                      placeholder="(206) 657-8426"
                      error={!!errors.phone?.national}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="region"
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <LocationSelector
                      error={!!errors.region?.[0]}
                      disabled={isSubmitting}
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
                          countryName || "",
                          state?.name || "",
                        ]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="license"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onValueChange={(files) => {
                        const validFiles = files.filter(
                          (file) => file.size <= 5 * 1024 * 1024,
                        );
                        if (validFiles.length !== files.length) {
                          form.setError("license", {
                            message: "Some files exceed the 5MB size limit",
                          });
                          return;
                        }
                        if (validFiles.length > 10) {
                          form.setError("license", {
                            message: "You can upload a maximum of 10 files",
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
                        <FileUploadTrigger asChild>
                          <div className="flex flex-col items-center gap-1 text-center">
                            <div className="flex items-center justify-center rounded-full border p-2.5">
                              <Upload className="size-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">
                              Drag & drop files here
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Or click to browse (max 3 files, up to 5MB each)
                            </p>
                          </div>
                        </FileUploadTrigger>
                      </FileUploadDropzone>
                      <FileUploadList orientation="horizontal">
                        {field.value.map((file, index) => (
                          <FileUploadItem
                            key={index}
                            value={file}
                            className="p-0"
                          >
                            <FileUploadItemPreview className="size-16">
                              <FileUploadItemProgress variant="fill" />
                            </FileUploadItemPreview>
                            <FileUploadItemMetadata className="sr-only" />
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="absolute -right-1 -top-1 size-5 rounded-full"
                              >
                                <X className="size-3" />
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="socials"
              disabled={isSubmitting}
              render={({ field }) => (
                <SocialInput
                  error={errors?.socials?.message}
                  {...field}
                  disable={isSubmitting}
                />
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                variant={"outline"}
                size={"lg"}
                className="rounded-full tracking-wide"
                type="button"
                disabled={isSubmitting}
                onClick={() => navigate("/onboarding")}
              >
                <span>Back</span>
              </Button>
              <Button
                isLoading={isSubmitting}
                txt="Please wait..."
                type="submit"
                className="w-full rounded-full tracking-wide"
                size={"lg"}
              >
                <span>Register</span>
                <FiArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        </motion.form>
      </Form>

      <motion.div
        variants={{
          enter: (currentStep: number) => ({
            x: currentStep > 0 ? 100 : -100,
            opacity: 0,
          }),
          center: {
            x: 0, // Centered position
            opacity: 1,
          },
          exit: (currentStep: number) => ({
            x: currentStep > 0 ? -100 : 100,
            opacity: 0,
          }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { duration: 0.5, ease: "linear" },
          opacity: { duration: 0.5, ease: "linear" },
        }}
        className="hidden w-full max-w-[45%] items-center p-4 lg:flex"
      >
        <div className="h-full w-full overflow-hidden rounded-2xl bg-primary">
          <img
            src={assets.svgs.stepFour}
            alt="STEP FOUR"
            className="h-full w-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
