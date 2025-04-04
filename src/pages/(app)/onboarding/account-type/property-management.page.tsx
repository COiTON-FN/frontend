//! Third-party libraries
import { motion } from "framer-motion";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiArrowRightOutline } from "react-icons/ti";
import { Check, ChevronsUpDown, Loader, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { formatPhoneNumber } from "react-phone-number-input";


//! Redux
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";

//! Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SocialInput from "../_components/social-input";
import { PhoneInput } from "@/components/extension/phone-input";

//! Utilities
import {
  cn,
  CountryData,
  getCountries,
  getStatesByCountry,
  StateData,
} from "@/lib/utils";
import { assets } from "@/assets";
import { registrationSchema } from "@/utils/validators";
import { stringToByteArray } from "@/lib/starknet/utils";
import { useContractInstance } from "@/hooks/useContractInstance.hook";

//! React and Router
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWalletHook from "@/hooks/useWallet.hook";
import { CairoCustomEnum } from "starknet";
import { setCredential, User, UserType } from "@/store/slice/credential.slice";
import { DropzoneOptions } from "react-dropzone";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/extension/file-uploader";
import { useUploadFileToPinataHook } from "@/hooks/upload/useUploadFileToPinata.hook";
import { setHasRegistered } from "@/store/slice/wallet.slice";

const propertyManagementSchema = registrationSchema.extend({});

export type PROPERTY_MANAGEMENT_SCHEMA = z.infer<
  typeof propertyManagementSchema
>;


const daoManagementSchema = registrationSchema.extend({
  license: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      }),
    )
    .min(1, {
      message: "License is required",
    })
    .max(3, {
      message: "Maximum 3 files are allowed",
    }),
});

export type DAO_MANAGEMENT_SCHEMA = z.infer<typeof daoManagementSchema>;

export default function PropertyManagementPage() {
  const navigate = useNavigate();

  const [countryPopover, setCountryPopover] = useState(false);
  const [statePopover, setStatePopover] = useState(false);

  const [countries, setCountries] = useState<CountryData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);
  const { handleConnectWallet } = useWalletHook();
  const { getContractInstance } = useContractInstance();
  const location = useLocation();

  const walletStore = useSelector((state: RootState) => state.wallet);

  const form = useForm<DAO_MANAGEMENT_SCHEMA | PROPERTY_MANAGEMENT_SCHEMA>({
    resolver: zodResolver(location?.state?.type === "Entity" ? daoManagementSchema : propertyManagementSchema),
    defaultValues: {

    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;


  const dropZoneConfig = {
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
      "application/msword": [".doc"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 3,
    maxSize: 1024 * 1024 * 10,
    multiple: true,
  } satisfies DropzoneOptions;



  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const state = location.state;
    if (!state?.type) {
      navigate("/onboarding")
    }
  }, [])



  useEffect(() => {
    setCountries(getCountries());
  }, []);

  useEffect(() => {
    form.setValue(
      "phone.international",
      formatPhoneNumber(form.watch("phone.national")),
    );
  }, [form.watch("phone.national")]);

  const handleCountryChange = (countryCode: string) => {
    const country: CountryData | undefined = countries.find(
      (c) => c.countryCode === countryCode,
    );

    if (country) {
      form.setValue("region.country", country);
      const newStates: StateData[] = getStatesByCountry(countryCode);
      setStates(newStates);
      form.setValue("region.state", {
        stateName: "",
        stateCode: "",
        countryCode: "",
        stateLat: 0,
        stateLong: 0,
      });
    }
  };

  const handleStateChange = (stateCode: string) => {
    const state: StateData | undefined = states?.find(
      (s) => s.stateCode === stateCode,
    );

    if (state) {
      form.setValue("region.state", state);
    }
  };


  const { onUpload } = useUploadFileToPinataHook();
  const dispatch = useAppDispatch();
  const onSubmit = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true)
      const formData = form.getValues();
      const { region, email, name, phone } = formData;

      // Validate top-level fields
      if (!email || !name || !phone?.national || !phone?.national) {
        return;
      }

      // Validate `region.country` fields
      if (
        !region?.country?.countryLat ||
        !region.country.countryLong ||
        !region.country.countryCode ||
        !region.country.countryName
      ) {
        return;
      }
      let licenseCid: string[] | null = null;
      if (location?.state?.type === "Entity") {
        licenseCid = await onUpload((formData as DAO_MANAGEMENT_SCHEMA).license);
      }




      if (!walletStore.isWalletConnected) {
        await handleConnectWallet();
      }





      const contract = getContractInstance();
      const user_type: UserType | undefined = location.state?.type;
      const userType = new CairoCustomEnum(user_type === "Individual" ? { Individual: {} } : { Entity: {} })
      const processed_data = { ...formData, ...(location?.state?.type === "Entity" ? { licenseCid } : {}) }
      console.log(processed_data)
      const detailsToBytesArray = stringToByteArray(JSON.stringify(processed_data));
      const call = contract!.populate("register", [
        userType,
        detailsToBytesArray,
      ])

      const account = window.Wallet.Account;
      const tx = await account?.execute(call);
      await account?.waitForTransaction(tx!.transaction_hash);
      setIsLoading(false);
      const user_construct: User = {
        address: account?.address!,
        details: processed_data,
        registered: true,
        user_type: location?.state?.type,
        verified: false,

      }
      dispatch(setCredential(user_construct))
      dispatch(setHasRegistered(true))

      navigate("/dashboard")

    } catch (error) {
      setIsLoading(false);

      console.error("Unexpected error during transaction:", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  };

  return (
    <div className="flex lg:h-full">
      <Form  {...form}>
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
                Personalize Your Experience
              </p>
              <p className="text-base font-normal text-muted-foreground sm:text-lg">
                For the best user experience, enter your information.
              </p>
            </div>

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Albert Freeman"
                      type="text"
                      className={cn("text-foreground", {
                        "border-red-500 focus-visible:ring-red-500":
                          errors.name,
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="albert.freeman@starknet.io"
                      type="email"
                      className={cn("text-foreground", {
                        "border-red-500 focus-visible:ring-red-500":
                          errors.email,
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phone.national"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <PhoneInput
                      placeholder="(206) 657-8426"
                      className={cn("text-foreground", {
                        "border-red-500 focus-visible:ring-red-500":
                          errors.phone,
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <FormField
                control={control}
                name="region.country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Popover
                      open={countryPopover}
                      onOpenChange={setCountryPopover}
                    >
                      <FormControl className="w-full">
                        <PopoverTrigger className="w-full" asChild>
                          <div
                            aria-expanded={countryPopover}
                            role="combobox"
                            className={cn(
                              "flex h-12 !w-full cursor-pointer items-center justify-between rounded-md border border-neutral-200 bg-background px-5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-xl sm:text-base",
                              {
                                "border-red-500 focus-visible:ring-red-500":
                                  errors.region?.country,
                              },
                            )}
                          >
                            {field.value?.countryName
                              ? countries.find(
                                (country) =>
                                  country.countryName ===
                                  field.value?.countryName,
                              )?.countryName
                              : "Select country..."}
                            <ChevronsUpDown className="size-4 opacity-50" />
                          </div>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-[480px] p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {countries.map((country) => (
                                <CommandItem
                                  key={country.countryCode}
                                  value={country.countryName}
                                  onSelect={() => {
                                    form.setValue("region.country", country);
                                    handleCountryChange(country.countryCode);
                                    setCountryPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-1 size-4",
                                      field.value?.countryName ===
                                        country.countryName
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <span className="mr-2 text-2xl">
                                    {country.countryFlag}
                                  </span>
                                  {country.countryName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="region.state"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Popover open={statePopover} onOpenChange={setStatePopover}>
                      <FormControl className="w-full">
                        <PopoverTrigger className="w-full" asChild>
                          <div
                            aria-expanded={statePopover}
                            role="combobox"
                            className={cn(
                              "flex h-12 !w-full cursor-pointer items-center justify-between rounded-md border border-neutral-200 bg-background px-5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:rounded-xl sm:text-base",
                              {
                                "border-red-500 focus-visible:ring-red-500":
                                  errors.region?.state,
                              },
                            )}
                          >
                            {field.value?.stateName
                              ? states.find(
                                (state) =>
                                  state.stateName === field.value?.stateName,
                              )?.stateName
                              : "Select state..."}
                            <ChevronsUpDown className="size-4 opacity-50" />
                          </div>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-[480px] p-0">
                        <Command>
                          <CommandInput placeholder="Search state..." />
                          <CommandList>
                            <CommandEmpty>No state found.</CommandEmpty>
                            <CommandGroup>
                              {states.map((state) => (
                                <CommandItem
                                  key={state.stateCode}
                                  value={state.stateName}
                                  onSelect={() => {
                                    form.setValue("region.state", state);
                                    handleStateChange(state.stateCode);
                                    setStatePopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-1 size-4",
                                      field.value?.stateName === state.stateName
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {state.stateName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            {location?.state?.type === "Entity" ? <FormField
              control={control}
              name="license"
              render={({ field }) => (
                <FormItem>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    dropzoneOptions={dropZoneConfig}
                    className="relative"
                  >
                    <FileInput
                      className={cn(
                        "rounded-md border border-neutral-200 sm:rounded-xl",
                        {
                          "border-red-500": (errors as FieldErrors<DAO_MANAGEMENT_SCHEMA>).license,
                        },
                      )}
                    >
                      <div className="flex h-14 w-full items-center px-6">
                        Click to upload license
                      </div>
                    </FileInput>
                    <FileUploaderContent className="flex">
                      {field.value &&
                        field.value.length > 0 &&
                        field.value.map((file, i) => (
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
                    </FileUploaderContent>
                  </FileUploader>
                  <FormMessage />
                </FormItem>
              )}
            /> : null}

            <FormField
              control={control}
              name="socials"
              render={({ field }) => (
                <SocialInput error={errors?.socials?.message} {...field} />
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                variant={"outline"}
                size={"lg"}
                className="rounded-full tracking-wide"
                type="button"
                onClick={() => navigate("/onboarding")}
              >
                <span>Back</span>
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full rounded-full tracking-wide"
                size={"lg"}
              >
                {isLoading ? (
                  <>
                    <Loader className="size-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <TiArrowRightOutline className="size-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.form>
      </Form>

      <motion.div
        variants={{
          enter: (currentStep: number) => ({
            x: currentStep > 0 ? 100 : -100, // Enter from right if moving forward, left if going back
            opacity: 0,
          }),
          center: {
            x: 0, // Centered position
            opacity: 1,
          },
          exit: (currentStep: number) => ({
            x: currentStep > 0 ? -100 : 100, // Exit to left if moving forward, right if going back
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
