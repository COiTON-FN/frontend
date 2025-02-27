import { FC, memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader, Lock, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  setHasAllowedSpending,
  setHasStakedModalOpen,
} from "@/store/slice/modal.slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useFetchAllowanceHook } from "@/hooks/contract/useFetchAllowance.hook";
import {
  useSendTransaction,
  useTransactionReceipt,
} from "@starknet-react/core";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { Contract } from "starknet";
import { contract } from "@/utils/contract";

const StakeToken: FC = () => {
  const { daoAddress } = contract;
  const { getContractInstance, getErc20Instance } = useContractInstance();
  const contractInstance: Contract = getContractInstance();
  const erc20Instance: Contract = getErc20Instance();

  const dispatch = useDispatch<AppDispatch>();
  const modalState = useSelector((state: RootState) => state.modal);

  const { allowance } = useFetchAllowanceHook();

  const stakingFee = BigInt("20000000000000000000");

  // Check if allowance is sufficient
  const allowanceSufficient = useMemo(() => {
    const currentAllowance = allowance !== null ? BigInt(allowance) : null;
    return currentAllowance !== null && currentAllowance >= stakingFee;
  }, [allowance, stakingFee]);

  const calls = useMemo(() => {
    if (!allowanceSufficient) {
      return [erc20Instance.populate("approve", [daoAddress, stakingFee])];
    }
    return [contractInstance.populate("stake_listing_fee", [])];
  }, [
    allowanceSufficient,
    erc20Instance,
    contractInstance,
    daoAddress,
    stakingFee,
  ]);

  const transaction = useSendTransaction({
    calls,
  });

  const receipt = useTransactionReceipt({
    hash: transaction?.data?.transaction_hash,
    watch: true,
  });

  const isLoading = receipt?.isLoading || transaction?.isPending;

  const handleTransaction = async () => {
    try {
      await transaction.sendAsync();

      if (receipt?.data?.isSuccess) {
        dispatch(setHasStakedModalOpen(false));
        if (!allowanceSufficient) {
          dispatch(setHasAllowedSpending(false));
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const isModalOpen =
    modalState.hasStakedModalOpen || modalState.hasAllowedSpending;

  const handleClose = () => {
    dispatch(setHasStakedModalOpen(false));
    dispatch(setHasAllowedSpending(false));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90%] max-w-[425px] !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-satoshi text-center">
            {allowanceSufficient ? "Stake Your Tokens" : "Approve Spending"}
          </DialogTitle>
          <DialogDescription className="text-base font-normal leading-6 text-center">
            {allowanceSufficient
              ? "Secure your listing with $CTN tokens."
              : "Allow the platform to spend your $CTN tokens."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
            {allowanceSufficient ? (
              <Lock className="w-10 h-10 text-primary" />
            ) : (
              <CheckCircle className="w-10 h-10 text-primary" />
            )}
          </div>
          <p className="text-center text-lg">
            {allowanceSufficient
              ? `To create a new listing, you need to commit
            20 $CTN tokens.`
              : `You need to approve spending of
            20 $CTN tokens by the platform.`}
          </p>
          <p className="text-sm text-muted-foreground text-center">
            This step is essential to maintain the quality and reliability of
            our platform.
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleTransaction}
            disabled={isLoading}
            size={"lg"}
            className="w-[90%] rounded-full"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin size-5" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>
                {allowanceSufficient ? "Stake Tokens" : "Approve Spending"}
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(StakeToken);

// import { memo, useMemo } from "react";
// import { Button } from "../ui/button";
// import { AppDispatch, RootState } from "@/store";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setHasAllowedSpending,
//   setHasStakedModalOpen,
// } from "@/store/slice/modal.slice";
// import { useContractInstance } from "@/hooks/useContractInstance.hook";
// import { useFetchAllowanceHook } from "@/hooks/contract/useFetchAllowance.hook";
// import { Contract } from "starknet";
// import { contract } from "@/utils/contract";
// import {
//   useSendTransaction,
//   useTransactionReceipt,
// } from "@starknet-react/core";

// const StakeToken = () => {
//   const { daoAddress } = contract;
//   const dispatch = useDispatch<AppDispatch>();
//   const modalState = useSelector((state: RootState) => state.modal);
//   const { allowance } = useFetchAllowanceHook();
// const { getContractInstance, getErc20Instance } = useContractInstance();
// const contractInstance: Contract = getContractInstance();
// const erc20Instance: Contract = getErc20Instance();

// const stakingFee = BigInt("20000000000000000000");

// // Check if allowance is sufficient
// const allowanceSufficient = useMemo(() => {
//   const currentAllowance = allowance !== null ? BigInt(allowance) : null;
//   return currentAllowance !== null && currentAllowance >= stakingFee;
// }, [allowance, stakingFee]);

//   // Determine the transaction calls based on allowance status
// const calls = useMemo(() => {
//   if (!allowanceSufficient) {
//     return [erc20Instance.populate("approve", [daoAddress, stakingFee])];
//   }
//   return [contractInstance.populate("stake_listing_fee", [])];
// }, [
//   allowanceSufficient,
//   erc20Instance,
//   contractInstance,
//   daoAddress,
//   stakingFee,
// ]);

// const transaction = useSendTransaction({
//   calls,
// });

// const receipt = useTransactionReceipt({
//   hash: transaction?.data?.transaction_hash,
//   watch: true,
// });

// const isLoading = receipt?.isLoading || transaction?.isPending;

// const handleTransaction = async () => {
//   try {
//     await transaction.sendAsync();

//     if (receipt?.data?.isSuccess) {
//       dispatch(setHasStakedModalOpen(false));
//       if (!allowanceSufficient) {
//         dispatch(setHasAllowedSpending(false));
//       }
//     }
//   } catch (error) {
//     console.error("Transaction failed:", error);
//   }
// };

// // Handle modal open/close
// const isModalOpen =
//   modalState.hasStakedModalOpen || modalState.hasAllowedSpending;

// const handleClose = () => {
//   dispatch(setHasStakedModalOpen(false));
//   dispatch(setHasAllowedSpending(false));
// };

//   return (
{
  /* <Dialog open={isModalOpen} onOpenChange={handleClose}>
  <DialogContent className="w-[90%] max-w-[425px] !rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl font-semibold font-satoshi text-center">
        {!allowanceSufficient ? "Stake Your Tokens" : "Approve Spending"}
      </DialogTitle>
      <DialogDescription className="text-base font-normal leading-6 text-center">
        {!allowanceSufficient
          ? "Secure your listing with $CTN tokens."
          : "Allow the platform to spend your $CTN tokens."}
      </DialogDescription>
    </DialogHeader>
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
        {!allowanceSufficient ? (
          <Lock className="w-10 h-10 text-primary" />
        ) : (
          <CheckCircle className="w-10 h-10 text-primary" />
        )}
      </div>
      <p className="text-center text-lg">
        {!allowanceSufficient
          ? `To create a new listing, you need to commit
            20 $CTN tokens.`
          : `You need to approve spending of
            20 $CTN tokens by the platform.`}
      </p>
      <p className="text-sm text-muted-foreground text-center">
        This step is essential to maintain the quality and reliability of
        our platform.
      </p>
    </div>
    <div className="flex justify-center mt-6">
<Button
  onClick={handleTransaction}
  disabled={isLoading}
  size={"lg"}
  className="w-[90%] rounded-full"
>
  {isLoading ? (
    <>
      <Loader className="animate-spin size-5" />
      <span>Please wait...</span>
    </>
  ) : (
    <span>
      {!allowanceSufficient ? "Stake Tokens" : "Approve Spending"}
    </span>
  )}
</Button>
    </div>
  </DialogContent>
</Dialog> */
}
//   );
// };

// export default memo(StakeToken);
