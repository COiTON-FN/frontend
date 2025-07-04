import { variables } from "@/utils/variables";
import { Calldata, Contract, RawArgs } from "starknet";

interface WriteTransactionProps {
  entrypoint: string;
  calldata: RawArgs | Calldata | undefined;
  contract?: Contract;
}

interface TransactionResponseProps {
  success: boolean;
  data: {
    transaction_hash: string;
  };
  message: string;
}

export async function executeFn({
  entrypoint,
  calldata,
  contract,
}: WriteTransactionProps) {
  const account = window.Wallet.Account;
  if (!account) throw new Error("Execution aborted: Wallet is not connected.");

  if (!contract) throw new Error("Execution aborted: Wallet is not connected.");

  try {
    // console.log(
    //   "Attempting to execute entrypoint(s):",
    //   calls.map((c) => c.entrypoint).join(", "),
    // );
    const call = contract!.populate(entrypoint, calldata);

    const outsideExecutionPayload = await account.getOutsideExecutionPayload({
      calls: [call],
    });
    // const call = await account.getOutsideExecutionPayload({ calls });

    const response = await fetch(
      `${variables.renderEndpoint}/contract/execute`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(outsideExecutionPayload),
        redirect: "follow",
      },
    );
    const result: TransactionResponseProps = await response.json();

    if (!result?.success) {
      const message =
        result.message ||
        "Unknown error occurred during transaction execution.";
      throw new Error(message);
    }

    return result;
  } catch (error: any) {
    const errMsg =
      error?.message ||
      "Unexpected error occurred while executing contract function.";
    console.error("Execution aborted:", errMsg);
    throw new Error(errMsg);
  }
}
