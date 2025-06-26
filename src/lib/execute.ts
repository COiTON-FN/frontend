import { variables } from "@/utils/variables";
import { toast } from "sonner";
import { Calldata, CallData, RawArgs } from "starknet";

interface WriteTransactionProps {
  contractAddress: string;
  entrypoint: string;
  calldata: RawArgs | Calldata | undefined;
}

interface TransactionResponseProps {
  success: boolean;
  data: {
    transaction_hash: string;
  };
  message: string;
}

export async function executeFn({
  contractAddress,
  entrypoint,
  calldata,
}: WriteTransactionProps) {
  const calls = [
    {
      contractAddress,
      entrypoint,
      calldata: CallData.compile({
        ...calldata,
      }),
    },
  ];

  const account = window.Wallet.Account;

  if (!account) throw new Error("Wallet not connected!");

  try {
    const call = await account?.getOutsideExecutionPayload({
      calls,
    });

    console.log({ call });

    console.log("CALLING ENDPOINT");
    const response = await fetch(
      `${variables.renderEndpoint}/contract/execute`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(call),
        redirect: "follow",
      },
    );

    console.log("ENDPOINT CALLED");

    const result: TransactionResponseProps = await response.json();

    if (!result?.success) {
      toast.error(result?.message);
      throw new Error(result?.message);
    }

    return result;
  } catch (error: any) {
    console.error("EXECUTE FN ERROR: ", error);
  }
}
