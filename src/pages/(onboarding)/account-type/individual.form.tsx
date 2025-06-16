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
import { CairoCustomEnum } from "starknet";
import { stringToByteArray } from "@/lib/starknet/utils";
import { executeFn } from "@/lib/execute";
import { contract } from "@/utils/contract";
import { setHasRegistered } from "@/store/slice/wallet.slice";

const individualFormSchema = z.object({
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
});

type IndividualFormSchemaProps = z.infer<typeof individualFormSchema>;

export default function IndividualForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleConnectWallet } = useWalletHook();

  const walletStore = useAppSelector((state: RootState) => state.wallet);
  const credentialStore = useAppSelector(
    (state: RootState) => state.credential.credential,
  );

  const [countryName, setCountryName] = React.useState<string>("");
  const [stateName, setStateName] = React.useState<string>("");

  const form = useForm<IndividualFormSchemaProps>({
    resolver: zodResolver(individualFormSchema),
    defaultValues: {
      name: "",
      email: credentialStore?.details?.email ?? "",
      phone: {
        national: "",
        international: "",
      },
      region: undefined,
      socials: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  React.useEffect(() => {
    if (credentialStore?.details?.email) {
      form.setValue("email", credentialStore.details.email);
    }
  }, [credentialStore?.details?.email, form]);

  React.useEffect(() => {
    const number = formatPhoneNumber(form.watch("phone.national"));
    form.setValue("phone.international", number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("phone.national")]);

  async function onSubmit(formData: IndividualFormSchemaProps) {
    try {
      if (!walletStore.isWalletConnected) {
        await handleConnectWallet();
      }

      const userType = new CairoCustomEnum({ Individual: {} });
      const processed_data = { ...formData };
      console.log(processed_data);
      const detailsToBytesArray = stringToByteArray(
        JSON.stringify(processed_data),
      );

      const result = await executeFn({
        contractAddress: contract.daoAddress,
        entrypoint: "register",
        calldata: [userType, detailsToBytesArray],
      });

      if (!result?.success) return;

      const account = window.Wallet.Account;

      const user_construct: User = {
        address: account?.address as string,
        details: processed_data,
        registered: true,
        user_type: "Individual",
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
                Personalize Your Experience
              </p>
              <p className="text-base font-normal text-muted-foreground sm:text-lg">
                For the best user experience, enter your information.
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
                disabled={credentialStore?.details?.email || isSubmitting}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        disabled={credentialStore?.details?.email}
                        placeholder="Enter your email address"
                        type="email"
                        error={!!errors.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      It will automatically fill up your email if you are
                      connected.
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
