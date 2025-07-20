import { FC, ReactNode, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Listing, PurchaseRequest } from "@/store/slice/listing.slice";
import { toast } from "sonner";
import { contract } from "@/utils/contract";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { cairo, CairoOption, CairoOptionVariant } from "starknet";
import { executeFn } from "@/lib/execute";
import { useAccount, useConnect, } from "@starknet-react/core";
import { setIsWalletConnected, setWalletAddress } from "@/store/slice/wallet.slice";
import { parseUnits } from "@/lib/utils";

interface BidModalProps {
  children: ReactNode;
  listing?: Listing;
  purchaseRequests: Array<PurchaseRequest>;
  setPurchaseRequests: React.Dispatch<React.SetStateAction<PurchaseRequest[]>>;
}

export const BidModal: FC<BidModalProps> = ({
  children,
  listing,
  purchaseRequests,
  setPurchaseRequests,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const { getErc20Instance, getWalletProviderContract } = useContractInstance();
  const { connectAsync, connectors } = useConnect()

  const { hasRegistered } = useAppSelector((state: RootState) => state.wallet);
  const { credential } = useAppSelector((state: RootState) => state.credential);
  const { walletAddress } = useAppSelector((state: RootState) => state.wallet);

  const bidFormSchema = z.object({
    bid: z.coerce
      .number({
        invalid_type_error: "Bid must be a number",
        required_error: "Bid is required",
      })
      .min(
        purchaseRequests.length > 0
          ? purchaseRequests.sort((a, b) => b.price - a.price)[0].price + 1
          : (listing?.price ?? 0),
        { message: "Bid must exceed current price" },
      ),
  });

  type BidFormSchemaProps = z.infer<typeof bidFormSchema>;

  const form = useForm<BidFormSchemaProps>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: { bid: 0 },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      setOpen(false);
      form.reset();
    }
  }, [isSubmitSuccessful, form]);

  // const handleConnect = async ({
  //   callbackData,
  //   approval = parseUnits("100").toString(),
  // }: {
  //   callbackData?: string;
  //   approval?: string;
  // }) => {
  //   console.log(approval.toString());
  //   const response = await argentWebWallet.requestConnection({
  //     callbackData: callbackData,
  //     approvalRequests: [
  //       {
  //         tokenAddress: contract.erc20Address as any,
  //         amount: approval.toString(),
  //         // Your dapp contract
  //         spender: contract.daoAddress as any,
  //       },
  //     ],
  //   });
  //   console.log(response);

  //   if (response) {
  //     window.Wallet = {
  //       Account: response.account,
  //       IsConnected: true,
  //     };
  //     // Dispatch a custom event to notify about the change
  // const event = new Event("windowWalletClassChange");
  // window.dispatchEvent(event);
  //     return response.callbackData;
  //   }
  // };

  const { account, address } = useAccount();
  const dispatch = useAppDispatch()
  useEffect(() => {
    (function () {
      if (!address) return;
      if (window.Wallet?.Account) return;
      window.Wallet = {
        Account: account,
        IsConnected: true,
      };
      dispatch(setIsWalletConnected(true));
      dispatch(setWalletAddress(address?.toString()));
    }())
  }, [connectors, account])

  async function onSubmit(values: BidFormSchemaProps) {
    const bidPrice = values.bid;

    if (bidPrice < (listing?.price ?? 0)) {
      toast.warning("Bid is too low");
      return;
    }

    if (isNaN(Number(bidPrice))) {
      toast.error("Invalid bid");
      return;
    }

    try {
      if (!window.Wallet?.IsConnected) {
        await connectAsync({ connector: connectors[0] });
      }

      if (!hasRegistered || !credential || !credential.address) {
        toast.warning("Look's like you're not registered");
        return;
      }

      if (credential.address?.toLowerCase() === listing?.owner.toLowerCase()) {
        toast.error("Owner can not perform action");
        return;
      }

      if (
        purchaseRequests.length > 0 &&
        purchaseRequests.filter(
          (request) =>
            request.initiator.toLowerCase() ===
            credential?.address.toLowerCase(),
        ).length > 0
      ) {
        toast.warning("Bid has already been created");
        return;
      }

      if (!listing?.owner_details?.verified) {
        toast.error("Agent is not verified!");
        return;
      }

      const erc20 = getErc20Instance();

      const account = window.Wallet.Account!;

      if (!account) throw new Error("Wallet not connected!");

      const allowance = await erc20!.allowance(
        walletAddress as string,
        contract.daoAddress,
      );

      const bidValue = bidPrice || listing.price
      if (Number(parseUnits(bidValue.toString())) > Number(allowance)) {
        const approval = await executeFn({
          entrypoint: "approve",
          calldata: [
            contract.daoAddress,
            parseUnits(bidValue.toString()),
          ],
          contract: erc20,
        });
        if (!approval.isSuccess()) {
          throw new Error("Insufficient allowance")
        }

      }

      // console.log(new CairoOption(CairoOptionVariant.Some, cairo.uint256(Number(parseUnits(bidValue.toString())))))

      const contract_ = getWalletProviderContract();

      const result = await executeFn({
        // contractAddress: contract.daoAddress,
        entrypoint: "create_purchase_request",
        calldata: [
          listing.id,
          new CairoOption(CairoOptionVariant.Some, cairo.uint256(Number(parseUnits(bidValue.toString())))),
        ],
        contract: contract_,
      });

      if (!result?.isSuccess()) return;

      toast.success("Bid submitted successfully");

      console.log(result);

      const new_purchase_request_construct: PurchaseRequest = {
        initiator: credential.address,
        listing_id: listing.id,
        price: bidPrice || listing.price,
        request_id: 0,
        user: credential,
      };

      setPurchaseRequests([
        new_purchase_request_construct,
        ...purchaseRequests,
      ]);

      setIsSubmitSuccessful(true);
    } catch (error) {
      setIsSubmitSuccessful(false);
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(String(error));
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm !rounded-3xl">
        <DialogHeader>
          <DialogTitle>Agreement Info</DialogTitle>
          <DialogDescription>
            Review property details, buyer offers, and initiate a purchase
            agreement based on current bids.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 flex flex-col gap-4"
          >
            <FormField
              name="bid"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2">
                    Current bid price is
                    <span className="font-medium text-primary">
                      $
                      {purchaseRequests.length > 0
                        ? purchaseRequests
                          .sort((a, b) => b.price - a.price)[0]
                          .price.toLocaleString()
                        : listing?.price.toLocaleString()}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`$${purchaseRequests.length > 0
                        ? purchaseRequests
                          .sort((a, b) => b.price - a.price)[0]
                          .price.toLocaleString()
                        : listing?.price.toLocaleString()
                        }`}
                      type="number"
                      disabled={isSubmitting}
                      error={!!errors.bid}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={isSubmitting}
                  variant="outline"
                  className="px-6"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                isLoading={isSubmitting}
                txt="Initiating..."
                type="submit"
                className="flex-1"
              >
                Initiate Agreement
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
