import * as React from "react";
import { RootState, useAppSelector } from "@/store";
import { PurchaseRequest } from "@/store/slice/listing.slice";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variables } from "@/utils/variables";
import { executeFn } from "@/lib/execute";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import * as Dialog from "@/components/ui/dialog";
import { truncateAddr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BiLeaf } from "react-icons/bi";

interface ApproveModalProps {
  children: React.ReactNode;
  request: PurchaseRequest;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
  children,
  request,
}) => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] =
    React.useState<boolean>(false);
  const { walletAddress } = useAppSelector((state: RootState) => state.wallet);

  const { getContractInstance, getErc721Instance, getWalletProviderContract } =
    useContractInstance();

  const approveBidFormSchema = z.object({
    listingId: z.number(),
    requestId: z.number(),
    initiator: z.string(),
  });

  type ApproveBidFormSchemaProps = z.infer<typeof approveBidFormSchema>;

  const form = useForm<ApproveBidFormSchemaProps>({
    resolver: zodResolver(approveBidFormSchema),
  });

  async function onSubmit(formValues: ApproveBidFormSchemaProps) {
    try {
      const erc721 = getErc721Instance();
      const contractInstance = getContractInstance();
      const approvedAddress = await erc721!.get_approved(formValues.listingId);
      const contract_ = getWalletProviderContract();
      if (approvedAddress !== walletAddress) {
        const approve_call = erc721!.populate("approve", [
          variables.daoAddress,
          formValues.listingId,
        ]);

        const result = await executeFn({
          // contractAddress: approve_call.contractAddress,
          entrypoint: approve_call.entrypoint,
          calldata: approve_call.calldata,
          contract: contract_,
        });

        if (!result?.isSuccess()) return;
      }

      const call = contractInstance!.populate("approve_purchase_request", [
        formValues.listingId,
        formValues.requestId,
      ]);

      const result = await executeFn({
        // contractAddress: call.contractAddress,
        entrypoint: call.entrypoint,
        calldata: call.calldata,
        contract: contract_,
      });

      if (!result?.isSuccess()) {
        return;
        // toast.error(result?.message);
        // throw new Error(result?.message);
      }
      console.log(result);
      toast.success("Approval successful");
      setIsSubmitSuccessful(true);

      setTimeout(() => {
        setIsSubmitSuccessful(false);
      }, 100);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      console.log("Error approving request", error);
    }
  }

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      setOpenModal(false);
      form.reset();
    }
  }, [isSubmitSuccessful, form]);

  React.useEffect(() => {
    if (request.initiator) form.setValue("initiator", request.initiator);
    if (request.request_id) form.setValue("requestId", request.request_id);
    if (request.listing_id) form.setValue("listingId", request.listing_id);
  }, [form, request.initiator, request.listing_id, request.request_id]);

  return (
    <Dialog.Dialog open={openModal} onOpenChange={setOpenModal}>
      <Dialog.DialogTrigger asChild>{children}</Dialog.DialogTrigger>
      <Dialog.DialogContent className="max-w-sm !rounded-3xl">
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Confirm Bid Approval</Dialog.DialogTitle>
          <Dialog.DialogDescription>
            By approving{" "}
            <strong>{request.user?.details?.name?.split(" ")[0]}'s</strong>{" "}
            offer of{" "}
            <strong>
              {
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                })
                  .format(request.price)
                  ?.split(".")[0]
              }
            </strong>
            , you agree to transfer the property to the following wallet
            address: <strong>{truncateAddr(request.user?.address, 10)}</strong>{" "}
            <br /> <br /> Please confirm to proceed with this transaction.
          </Dialog.DialogDescription>
        </Dialog.DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 flex flex-col gap-4"
          >
            <Dialog.DialogFooter>
              <Dialog.DialogClose
                disabled={form.formState.isSubmitting}
                asChild
              >
                <Button
                  disabled={form.formState.isSubmitting}
                  variant="outline"
                  className="px-6"
                >
                  Cancel
                </Button>
              </Dialog.DialogClose>

              <Button
                isLoading={form.formState.isSubmitting}
                txt="Please wait..."
                type="submit"
                className="flex-1"
              >
                <BiLeaf className="size-4" />
                <span>Yes! Approve Request</span>
              </Button>
            </Dialog.DialogFooter>
          </form>
        </Form>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
};
