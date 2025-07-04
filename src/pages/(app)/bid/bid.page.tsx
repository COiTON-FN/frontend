import ProfileCard from "@/components/shared/profile-card";
import { Separator } from "@/components/ui/separator";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { byteArrayToString, toHex } from "@/lib/starknet/utils";
import { User } from "@/store/slice/credential.slice";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BID from "../../../assets/images/bid.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiLeaf } from "react-icons/bi";
import { Listing } from "@/store/slice/listing.slice";
import { cn, formatUser } from "@/lib/utils";
import { toast } from "sonner";
import { variables } from "@/utils/variables";
import { useAppSelector } from "@/store";
import { Loader } from "lucide-react";
import { executeFn } from "@/lib/execute";

export default function BidPage() {
  const [searchParams] = useSearchParams();

  const requestId = searchParams.get("requestId");
  const listingId = searchParams.get("listingId");

  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [initiator, setInitiator] = useState<User | null>(null);
  const [listingDetails, setListingDetails] = useState<{
    banner: string;
    snapshot: string;
    type: string;
    zip: number;
    bidPrice: number;
    price: number;
    state: string;
    country: string;
  } | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { walletAddress } = useAppSelector((state) => state.wallet);

  const { getContractInstance, getErc721Instance, getWalletProviderContract } = useContractInstance();

  useEffect(() => {
    (async () => {
      try {
        if (!requestId || !listingId) return;

        const contract = getContractInstance();
        if (!contract) return;
        setIsLoadingDetails(true);

        const listing = await contract.get_listing(Number(listingId));

        const purchaseRequest = await contract.get_purchase(
          listingId,
          requestId,
        );
        const refinedPurchaseRequest = {
          listingId,
          requestId,
          price: Number(purchaseRequest?.price),
          initiator: toHex(purchaseRequest?.initiator),
        };

        const initiatorDetails = await contract.get_user(
          refinedPurchaseRequest?.initiator,
        );
        const initiator = formatUser(initiatorDetails);

        setInitiator(initiator);

        const structured: Listing = {
          id: Number(listing.id),
          owner: toHex(listing.owner),
          price: Number(listing.price),
          tag: listing.tag.variant.Sold ? "Sold" : "ForSale",
          details: byteArrayToString(listing.details),
          owner_details: undefined,
        };

        const snapshotDetails = {
          banner: structured?.details?.imagesCid[0],
          snapshot: structured?.details?.description,
          type: structured?.details?.structureType,
          zip: Number(structured?.details?.zip),
          bidPrice: Number(refinedPurchaseRequest?.price),
          price: Number(structured?.details?.price),
          state: structured?.details?.region?.state
            ? structured?.details?.region?.state?.stateName
            : structured?.details?.region[1],
          country: structured?.details?.region?.country
            ? structured?.details?.region?.country?.countryName
            : structured?.details?.region[0],
        };

        setListingDetails(snapshotDetails);
        setIsLoadingDetails(false);
      } catch (error) {
        console.error("Failed to load requests:", error);
        setIsLoadingDetails(false);
      }
    })();
  }, [getContractInstance, listingId, requestId]);

  const handleApprovePurchaseRequest = async () => {
    if (!requestId || !listingId || !listingDetails || !initiator) return;

    try {
      setIsApproving(true);

      const erc721 = getErc721Instance();
      const contractInstance = getContractInstance();
      const approvedAddress = await erc721!.get_approved(listingId);
      const contract_ = getWalletProviderContract();
      if (approvedAddress !== walletAddress) {
        const approve_call = erc721!.populate("approve", [
          variables.daoAddress,
          listingId,
        ]);

        const result = await executeFn({
          // contractAddress: approve_call.contractAddress,
          entrypoint: approve_call.entrypoint,
          calldata: approve_call.calldata,
          contract: contract_
        });

        if (!result?.success) return;
      }

      const call = contractInstance!.populate("approve_purchase_request", [
        listingId,
        requestId,
      ]);

      const result = await executeFn({
        // contractAddress: call.contractAddress,
        entrypoint: call.entrypoint,
        calldata: call.calldata,
        contract: contract_

      });

      if (!result?.success) {
        toast.error(result?.message);
        throw new Error(result?.message);
      }

      setIsApproving(false);
      toast.success("E don sup");

      console.log(result);

      // const call = contract.populate("approve_purchase_request", [
      //   listingId,
      //   requestId,
      // ]);

      // console.log(callPayload);

      // console.log("CALLING ENDPOINT");
      // const response = await fetch(
      //   `${variables.renderEndpoint}/contract/execute`,
      //   {
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //     method: "POST",
      //     body: JSON.stringify(callPayload),
      //     redirect: "follow",
      //   },
      // );

      // console.log("ENDPOINT CALLED");

      // const result = await response.json();

      // if (!result?.success) {
      //   toast.error(result?.message);
      //   throw new Error(result?.message);
      // }

      // setIsApproving(false);
      // return result;

      // const result = await executeFn({
      //   contractAddress: contract.erc721Address,
      //   entrypoint: "approve_purchase_request",
      //   calldata: [listingId, requestId],
      // });

      // if (!result?.value) return;

      console.log(result);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      setIsApproving(false);
    }
  };

  console.log(listingDetails);

  if (isLoadingDetails)
    return (
      <div className="flex h-[calc(100dvh-80px)] flex-col items-center justify-center gap-2">
        <Loader className="size-6 animate-spin" />
        <p className="text-xs font-medium uppercase">Please wait...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex w-full flex-col gap-4 sm:gap-6 md:gap-10">
        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <ProfileCard credentialStore={initiator} />

          <div className="flex w-full flex-col gap-6 rounded-2xl border bg-background py-6 sm:p-6 md:gap-10 md:p-10 xl:w-[60%]">
            <div className="aspect-[1.4] w-full overflow-hidden rounded-2xl border bg-secondary lg:aspect-[1.3]">
              <img
                src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listingDetails?.banner}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                alt={`${listingDetails?.banner}`}
                className="size-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-primary">Snapshot</p>
              <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-base md:text-lg">
                <span
                  className={cn("md:font-normal", {
                    "line-clamp-4": !showMore,
                  })}
                >
                  {listingDetails?.snapshot}
                </span>
                <span
                  role="button"
                  onClick={() => setShowMore(!showMore)}
                  className="w-max font-medium text-primary"
                >
                  {showMore ? "View Less" : "View More"}
                </span>
              </pre>
            </div>

            <div className="flex flex-col gap-2">
              <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
                Building Info
              </p>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Type
                  </span>
                  <span className="text font-medium">
                    {listingDetails?.type}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Bid Price
                  </span>
                  <span className="text font-medium">
                    ${listingDetails?.bidPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    ZIP
                  </span>
                  <span className="text font-medium">
                    {listingDetails?.zip}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Price
                  </span>
                  <span className="text font-medium">
                    ${listingDetails?.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    State/County
                  </span>
                  <span className="text font-medium">
                    {listingDetails?.state}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Country
                  </span>
                  <span className="text font-medium">
                    {listingDetails?.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-2 h-px w-full" />

        <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-2">
          <div className="h-max space-y-7">
            <img src={BID} alt="" />
          </div>

          <div className="flex flex-col gap-10">
            <div className="">
              <label htmlFor="bid" className="text-sm text-muted-foreground">
                Bid Offer
              </label>
              <Input
                type="number"
                disabled
                id="bid"
                className="mt-1 text-sm"
                placeholder={`$${listingDetails?.bidPrice.toLocaleString()}`}
              />
              <p className="text-base text-muted-foreground">
                This is current bid offer from this user, you can either approve
                ot disapprove if this offer aligns with you.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                isLoading={isApproving}
                content="Approving..."
                className="w-[220px]"
                size="lg"
                onClick={handleApprovePurchaseRequest}
              >
                <BiLeaf className="size-5" />
                <span>Approve</span>
              </Button>
              <Button
                variant={"destructive"}
                disabled
                className="w-[220px]"
                size="lg"
              >
                <BiLeaf className="size-5" />
                <span>Disapprove</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
