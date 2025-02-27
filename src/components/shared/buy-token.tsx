import { memo, ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Loader } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { variables } from "@/utils/variables";
import { makePayment } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { setIsPurchaseTokenModalOpen } from "@/store/slice/modal.slice";

const formSchema = z.object({
  email: z.coerce
    .string()
    .email({
      message: "Invalid email",
    })
    .min(2, {
      message: "Email must be at least 2 characters long",
    }),
  address: z.string().min(10, { message: "Please enter a valid address" }),
  amount: z.coerce.number().min(5, {
    message: "Amount must be greater than 5",
  }),
});

const BuyToken = ({ children }: { children: ReactNode }) => {
  const { toast: notify } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const walletState = useSelector((state: RootState) => state.wallet);
  const modalState = useSelector((state: RootState) => state.modal);


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "fanosiv131@nongnue.com",
    },
  });

  const config = {
    reference: new Date().getTime().toString(),
    publicKey: variables.paystackPubKey,
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, amount } = values;
    const paystackConfig = {
      ...config,
      email,
      amount: amount * 100,
    };

    const initializePayment = usePaystackPayment(paystackConfig);
    dispatch(setIsPurchaseTokenModalOpen(false));

    const onSuccess = async (reference: any) => {
      const paymentData = {
        receipt: Number(reference?.trans),
        address: values.address,
      };
      const response = await makePayment(paymentData);
      dispatch(setIsPurchaseTokenModalOpen(true));

      if (response.status === 200 || response.status === 201) {
        notify({
          title: response.data?.message,
          description: `N${Number(
            values?.amount,
          ).toLocaleString()} worth of token will be in your address shortly`,
        });
      } else {
        notify({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    };

    const onClose = () => {
      console.log("Payment dialog closed.");
    };

    initializePayment({ onSuccess, onClose });
  }

  useEffect(() => {
    if (walletState.walletAddress) {
      form.setValue("address", walletState.walletAddress);
    }
  }, [walletState.walletAddress]);

  return (
    <Dialog
      open={modalState.isPurchaseTokenModalOpen}
      onOpenChange={(isOpen) => dispatch(setIsPurchaseTokenModalOpen(isOpen))}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90%] max-w-[425px] !rounded-2xl">
        <DialogHeader className="lex flex-col text-left">
          <DialogTitle className="font-satoshi text-2xl font-semibold">
            Purchase Token
          </DialogTitle>
          <DialogDescription className="text-base font-normal leading-6">
            Buy any amount of tokens using your local currency.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        type="email"
                        placeholder="johndoe@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="N20,000" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0x0036...577f"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Make sure to double-check your wallet address.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <Button
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              type="submit"
              size={"lg"}
              className="mx-auto w-[90%] rounded-full tracking-widest"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader className="size-6 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>Purchase</span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default memo(BuyToken);
