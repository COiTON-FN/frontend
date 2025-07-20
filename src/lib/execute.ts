// import { variables } from "@/utils/variables";
import { Calldata, Contract, RawArgs } from "starknet";
import { extractDecodedErrorReasons } from "./utils";

interface WriteTransactionProps {
  entrypoint: string;
  calldata: RawArgs | Calldata | undefined;
  contract?: Contract;
}

// interface TransactionResponseProps {
//   success: boolean;
//   data: {
//     transaction_hash: string;
//   };
//   message: string;
// }

export async function executeFn({
  entrypoint,
  calldata,
  contract,
}: WriteTransactionProps) {
  const account = window.Wallet.Account;

  if (!account) throw new Error("Execution aborted: Wallet is not connected.");
  if (!contract) throw new Error("Execution aborted: Wallet is not connected.");

  try {
    console.log("Attempting to execute entrypoint:", entrypoint);

    const call = contract!.populate(entrypoint, calldata);

    const tx = await account.execute(call);
    const receipt = await account.waitForTransaction(tx.transaction_hash);
    if (!receipt.isSuccess()) {
      const errMsg =
        "Unexpected error occurred while executing contract function.";
      console.error("Execution aborted:", errMsg);
      throw new Error(errMsg);
    }
    return receipt;
    // const result: TransactionResponseProps = await response.json();
    // const result =
    // const outsideExecutionPayload = await account.getOutsideExecutionPayload({
    //   calls: [call],
    // });

    // const response = await fetch(
    //   `${variables.renderEndpoint}/contract/execute`,
    //   {
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify(outsideExecutionPayload),
    //     redirect: "follow",
    //   },
    // );

    // if (!result?.success) {
    //   const message =
    //     result.message ||
    //     "Unknown error occurred during transaction execution.";
    //   throw new Error(message);
    // }

    // return result;
  } catch (error: any) {
    console.error("Execution Error:", error);
    const msg = extractDecodedErrorReasons(error.message);
    throw new Error(msg);
  }
}
